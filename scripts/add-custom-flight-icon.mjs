#!/usr/bin/env node

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const LUCIDE_BASE_URL =
  'https://raw.githubusercontent.com/lucide-icons/lucide/main/icons';
const SPRITE_PATH = path.join(
  projectRoot,
  'app/utils/custom-flight-icon-sprite.js',
);
const PATCH_PATH = path.join(
  projectRoot,
  'patches/@hashicorp__flight-icons.patch',
);

const DEFAULT_ATTRIBUTES = {
  fill: 'none',
  stroke: 'currentColor',
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round',
};

const requestedIcons = process.argv
  .slice(2)
  .map((name) =>
    name
      .replace(/\.svg$/i, '')
      .trim()
      .toLowerCase(),
  )
  .filter(Boolean);

if (requestedIcons.length === 0) {
  console.error(
    'Usage: pnpm node scripts/add-custom-flight-icon.mjs <icon> [...]',
  );
  process.exitCode = 1;
  process.exit();
}

function formatInnerContent(content, indent) {
  return content
    .trim()
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => `${indent}${line}`)
    .join('\n');
}

function renderSymbol(icon, size, strokeWidth, viewBox, attrs, innerContent) {
  const indent = '    ';
  const lines = [
    `${indent}<symbol`,
    `${indent}  id="flight-${icon}-${size}"`,
    `${indent}  viewBox="${viewBox}"`,
    `${indent}  fill="${attrs.fill}"`,
    `${indent}  stroke="${attrs.stroke}"`,
    `${indent}  stroke-width="${strokeWidth}"`,
    `${indent}  stroke-linecap="${attrs['stroke-linecap']}"`,
    `${indent}  stroke-linejoin="${attrs['stroke-linejoin']}"`,
    `${indent}>`,
    innerContent,
    `${indent}</symbol>`,
  ];

  return lines.join('\n');
}

function renderBlock({ icon, viewBox, attrs, innerContent, sourceUrl }) {
  const indent = '    ';
  const innerIndent = '      ';
  const formattedInner = formatInnerContent(innerContent, innerIndent);

  return [
    `${indent}<!-- Lucide ${icon} icon - ${sourceUrl} -->`,
    renderSymbol(icon, '16', '2', viewBox, attrs, formattedInner),
    '',
    renderSymbol(icon, '24', '2', viewBox, attrs, formattedInner),
  ].join('\n');
}

function matchAttribute(block, attribute) {
  const regex = new RegExp(`${attribute}="([^"]+)"`);
  const match = block.match(regex);
  return match ? match[1] : undefined;
}

function parseExistingBlocks(defsContent) {
  const blockRegex =
    /<!-- Lucide ([^ ]+) icon .*?-->\s*<symbol[\s\S]*?<\/symbol>\s*<symbol[\s\S]*?<\/symbol>/g;

  const blocks = new Map();

  for (const match of defsContent.matchAll(blockRegex)) {
    const [block, icon] = match;
    const urlMatch = block.match(/https:\/\/[^\s"]+/);
    const sourceUrl =
      urlMatch?.[0] ??
      `https://github.com/lucide-icons/lucide/blob/main/icons/${icon}.svg`;

    const symbolMatch = block.match(/<symbol[\s\S]*?<\/symbol>/);
    if (!symbolMatch) {
      continue;
    }

    const rawSymbol = symbolMatch[0];
    const viewBox = matchAttribute(rawSymbol, 'viewBox') ?? '0 0 24 24';
    const attrs = {
      fill: matchAttribute(rawSymbol, 'fill') ?? DEFAULT_ATTRIBUTES.fill,
      stroke: matchAttribute(rawSymbol, 'stroke') ?? DEFAULT_ATTRIBUTES.stroke,
      'stroke-linecap':
        matchAttribute(rawSymbol, 'stroke-linecap') ??
        DEFAULT_ATTRIBUTES['stroke-linecap'],
      'stroke-linejoin':
        matchAttribute(rawSymbol, 'stroke-linejoin') ??
        DEFAULT_ATTRIBUTES['stroke-linejoin'],
    };

    const innerMatch = rawSymbol.match(/>\s*([\s\S]*?)\s*<\/symbol>/);
    const innerContent = innerMatch ? innerMatch[1] : '';

    blocks.set(icon, {
      icon,
      viewBox,
      attrs,
      innerContent,
      sourceUrl,
    });
  }

  return blocks;
}

async function fetchLucideIcon(icon) {
  const url = `${LUCIDE_BASE_URL}/${icon}.svg`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch ${icon}: ${response.status} ${response.statusText}`,
    );
  }

  const svg = await response.text();
  const viewBoxMatch = svg.match(/viewBox="([^"]+)"/);
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 24 24';

  const attrs = { ...DEFAULT_ATTRIBUTES };
  for (const attribute of Object.keys(attrs)) {
    const value = matchAttribute(svg, attribute);
    if (value) {
      attrs[attribute] = value;
    }
  }

  const innerMatch = svg.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i);
  if (!innerMatch) {
    throw new Error(`Unable to parse SVG content for ${icon}`);
  }

  const innerContent = innerMatch[1];

  return {
    icon,
    viewBox,
    attrs,
    innerContent,
    sourceUrl: `https://github.com/lucide-icons/lucide/blob/main/icons/${icon}.svg`,
  };
}

function updatePatchFile(patchContents, iconsToEnsure) {
  const plusLineMatch = patchContents.match(
    /^\+export const iconNames = \[ (.*) \];$/m,
  );

  if (!plusLineMatch) {
    throw new Error(
      'Unable to locate export line in @hashicorp__flight-icons patch',
    );
  }

  const listString = plusLineMatch[1];
  const existingIcons = listString
    .split(', ')
    .map((entry) => entry.slice(1, -1)); // remove surrounding quotes

  let modified = false;

  for (const icon of iconsToEnsure) {
    if (existingIcons.includes(icon)) {
      continue;
    }
    existingIcons.push(icon);
    modified = true;
  }

  if (!modified) {
    return patchContents;
  }

  const updatedLine = `+export const iconNames = [ ${existingIcons
    .map((entry) => `'${entry}'`)
    .join(', ')} ];`;

  return patchContents.replace(plusLineMatch[0], updatedLine);
}

async function main() {
  const spriteContents = await readFile(SPRITE_PATH, 'utf8');
  const defsStart = spriteContents.indexOf('  <defs>\n');
  const defsEnd = spriteContents.indexOf('  </defs>');

  if (defsStart === -1 || defsEnd === -1) {
    throw new Error('Could not locate <defs> section in custom sprite file');
  }

  const header = spriteContents.slice(0, defsStart + '  <defs>\n'.length);
  const existingDefsBody = spriteContents.slice(
    defsStart + '  <defs>\n'.length,
    defsEnd,
  );
  const footer = spriteContents.slice(defsEnd);

  const blocks = parseExistingBlocks(existingDefsBody);

  const iconsNeedingSprites = requestedIcons.filter(
    (icon) => !blocks.has(icon),
  );

  for (const icon of iconsNeedingSprites) {
    const iconData = await fetchLucideIcon(icon);
    blocks.set(icon, iconData);
    console.log(`• Added ${icon}`);
  }

  if (iconsNeedingSprites.length === 0 && requestedIcons.length > 0) {
    requestedIcons.forEach((icon) =>
      console.log(`• ${icon} already present, skipping`),
    );
  }

  const sortedBlocks = Array.from(blocks.values()).sort((a, b) =>
    a.icon.localeCompare(b.icon),
  );

  const spriteChanged = iconsNeedingSprites.length > 0;

  if (spriteChanged) {
    const nextSpriteContents = `${header}${sortedBlocks
      .map((block) => renderBlock(block))
      .join('\n\n')}\n${footer}`;
    await writeFile(SPRITE_PATH, nextSpriteContents, 'utf8');
  }

  const desiredIcons = sortedBlocks.map((block) => block.icon);
  const patchContents = await readFile(PATCH_PATH, 'utf8');
  const updatedPatch = updatePatchFile(patchContents, desiredIcons);

  if (updatedPatch !== patchContents) {
    await writeFile(PATCH_PATH, updatedPatch, 'utf8');
    console.log('• Updated patch with custom icon names');
  }

  if (!spriteChanged && updatedPatch === patchContents) {
    console.log('No new icons were added.');
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

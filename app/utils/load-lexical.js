// Lexical is only needed once somebody opens the post editor, so it is pulled
// in through dynamic imports: ember-auto-import turns each of these into its
// own webpack chunk, fetched on demand rather than shipped in the main bundle.
//
// These live in a plain .js module on purpose — ember-auto-import does not
// rewrite import() inside .gjs files, so the browser would be left trying to
// resolve a bare specifier at runtime.
export default async function loadLexical() {
  const [
    core,
    richText,
    list,
    link,
    markdown,
    utils,
    selection,
    history,
    code,
  ] = await Promise.all([
    import('lexical'),
    import('@lexical/rich-text'),
    import('@lexical/list'),
    import('@lexical/link'),
    import('@lexical/markdown'),
    import('@lexical/utils'),
    import('@lexical/selection'),
    import('@lexical/history'),
    // Not surfaced in the toolbar, but the markdown transformers handle code
    // blocks, so the node has to be registered.
    import('@lexical/code'),
  ]);

  return {
    core,
    richText,
    list,
    link,
    markdown,
    utils,
    selection,
    history,
    code,
  };
}

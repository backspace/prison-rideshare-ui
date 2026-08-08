import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';
import { modifier } from 'ember-modifier';
import eq from 'ember-truth-helpers/helpers/eq';
import { waitForPromise } from '@ember/test-waiters';
import loadLexical from 'prison-rideshare-ui/utils/load-lexical';

const setupEditor = modifier((element, [component]) => {
  component.mount(element);

  return () => component.unmount();
});

const BLOCK_BUTTONS = [
  { name: 'heading', label: 'Heading', icon: 'H' },
  { name: 'quote', label: 'Quote', icon: '❞' },
  { name: 'bullet', label: 'Bulleted list', icon: '•' },
  { name: 'number', label: 'Numbered list', icon: '1.' },
];

export default class MarkdownEditor extends Component {
  @tracked isLoading = true;
  @tracked loadFailed = false;
  @tracked activeFormats = [];
  @tracked activeBlock = 'paragraph';

  lexical;
  editor;
  teardown;
  loadPromise;

  // Set while we are writing the incoming value into the editor, so the
  // resulting update does not echo straight back out to the caller.
  applyingExternalValue = false;

  get isBold() {
    return this.activeFormats.includes('bold');
  }

  get isItalic() {
    return this.activeFormats.includes('italic');
  }

  unmount() {
    this.teardown?.();
    this.teardown = undefined;
    this.editor = undefined;
  }

  async mount(element) {
    let lexical;

    try {
      lexical = await this.loadOnce();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('the editor failed to load', error);
      this.isLoading = false;
      this.loadFailed = true;
      return;
    }

    // The modal may have closed while the chunk was in flight.
    if (this.isDestroying || this.isDestroyed) {
      return;
    }

    const { core, richText, list, markdown, utils, history } = lexical;

    const editor = core.createEditor({
      namespace: 'log-post',
      nodes: [
        richText.HeadingNode,
        richText.QuoteNode,
        list.ListNode,
        list.ListItemNode,
        lexical.link.LinkNode,
        lexical.code.CodeNode,
      ],
      theme: {
        text: { bold: 'editor-bold', italic: 'editor-italic' },
      },
      onError: (error) => {
        // eslint-disable-next-line no-console
        console.error(error);
      },
    });

    editor.setRootElement(element);

    this.teardown = utils.mergeRegister(
      richText.registerRichText(editor),
      list.registerList(editor),
      history.registerHistory(editor, history.createEmptyHistoryState(), 300),
      editor.registerUpdateListener(({ editorState }) =>
        this.handleUpdate(editorState),
      ),
    );

    this.editor = editor;

    this.applyingExternalValue = true;
    editor.update(
      () => {
        markdown.$convertFromMarkdownString(
          this.args.value ?? '',
          markdown.TRANSFORMERS,
        );
      },
      { discrete: true },
    );
    this.applyingExternalValue = false;

    this.isLoading = false;
    this.args.onReady?.();
  }

  loadOnce() {
    // waitForPromise keeps the chunk load inside Ember's settledness, so tests
    // do not race the editor appearing.
    this.loadPromise ??= waitForPromise(
      loadLexical().then((lexical) => {
        this.lexical = lexical;
        return lexical;
      }),
    );

    return this.loadPromise;
  }

  handleUpdate(editorState) {
    const { core, markdown, list, richText } = this.lexical;

    editorState.read(() => {
      const selection = core.$getSelection();

      if (core.$isRangeSelection(selection)) {
        this.activeFormats = ['bold', 'italic'].filter((format) =>
          selection.hasFormat(format),
        );
        this.activeBlock = this.blockTypeFor(selection, { list, richText });
      }

      if (!this.applyingExternalValue) {
        this.args.onChange?.(
          markdown.$convertToMarkdownString(markdown.TRANSFORMERS),
        );
      }
    });
  }

  blockTypeFor(selection, { list, richText }) {
    const anchor = selection.anchor.getNode();
    const block =
      anchor.getKey() === 'root' ? anchor : anchor.getTopLevelElement();

    if (!block) {
      return 'paragraph';
    }

    if (list.$isListNode(block)) {
      return block.getListType() === 'number' ? 'number' : 'bullet';
    }

    if (richText.$isQuoteNode(block)) {
      return 'quote';
    }

    if (richText.$isHeadingNode(block)) {
      return 'heading';
    }

    return 'paragraph';
  }

  @action
  toggleInline(format) {
    this.editor?.dispatchCommand(this.lexical.core.FORMAT_TEXT_COMMAND, format);
    this.editor?.focus();
  }

  @action
  toggleBlock(name) {
    const editor = this.editor;

    if (!editor) {
      return;
    }

    const { core, richText, list, selection: selectionUtils } = this.lexical;
    const alreadyActive = this.activeBlock === name;

    if (name === 'bullet' || name === 'number') {
      const command = alreadyActive
        ? list.REMOVE_LIST_COMMAND
        : name === 'bullet'
          ? list.INSERT_UNORDERED_LIST_COMMAND
          : list.INSERT_ORDERED_LIST_COMMAND;

      editor.dispatchCommand(command, undefined);
      editor.focus();
      return;
    }

    editor.update(() => {
      const selection = core.$getSelection();

      if (!core.$isRangeSelection(selection)) {
        return;
      }

      selectionUtils.$setBlocksType(selection, () => {
        if (alreadyActive) {
          return core.$createParagraphNode();
        }

        return name === 'quote'
          ? richText.$createQuoteNode()
          : richText.$createHeadingNode('h1');
      });
    });

    editor.focus();
  }

  @action
  insertLink() {
    const editor = this.editor;

    if (!editor) {
      return;
    }

    const url = window.prompt('Link URL');

    if (url === null) {
      return;
    }

    editor.dispatchCommand(
      this.lexical.link.TOGGLE_LINK_COMMAND,
      url === '' ? null : url,
    );
    editor.focus();
  }

  <template>
    <div class='markdown-editor' data-test-markdown-editor>
      <div class='markdown-editor__toolbar' role='toolbar'>
        <button
          type='button'
          class='markdown-editor__button {{if this.isBold "is-active" ""}}'
          title='Bold'
          disabled={{this.isLoading}}
          data-test-markdown-editor-bold
          {{on 'click' (fn this.toggleInline 'bold')}}
        >
          <strong>B</strong>
        </button>

        <button
          type='button'
          class='markdown-editor__button {{if this.isItalic "is-active" ""}}'
          title='Italic'
          disabled={{this.isLoading}}
          data-test-markdown-editor-italic
          {{on 'click' (fn this.toggleInline 'italic')}}
        >
          <em>I</em>
        </button>

        {{#each BLOCK_BUTTONS as |item|}}
          <button
            type='button'
            class='markdown-editor__button
              {{if (eq this.activeBlock item.name) "is-active" ""}}'
            title={{item.label}}
            disabled={{this.isLoading}}
            data-test-markdown-editor-block={{item.name}}
            {{on 'click' (fn this.toggleBlock item.name)}}
          >
            {{item.icon}}
          </button>
        {{/each}}

        <button
          type='button'
          class='markdown-editor__button'
          title='Link'
          disabled={{this.isLoading}}
          data-test-markdown-editor-link
          {{on 'click' this.insertLink}}
        >
          🔗
        </button>
      </div>

      {{#if this.loadFailed}}
        <div class='markdown-editor__failed' data-test-markdown-editor-failed>
          The editor could not be loaded. Please reload the page.
        </div>
      {{else}}
        <div
          class='markdown-editor__surface'
          contenteditable='true'
          role='textbox'
          aria-multiline='true'
          aria-label='Post'
          data-test-markdown-editor-surface
          {{setupEditor this}}
        ></div>

        {{#if this.isLoading}}
          <div
            class='markdown-editor__loading'
            data-test-markdown-editor-loading
          >Loading the editor…</div>
        {{/if}}
      {{/if}}
    </div>
  </template>
}

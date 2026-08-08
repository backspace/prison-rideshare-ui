import { settled } from '@ember/test-helpers';
import { getter } from 'ember-cli-page-object/macros';
import { findOne } from 'ember-cli-page-object/extend';

// Page object actions for a contenteditable Lexical surface.
//
// fillIn cannot drive one: Lexical owns the DOM and reverts anything written
// to it directly. It does listen for beforeinput, so these dispatch the events
// a browser would.

function selectContents(element) {
  element.focus();

  const range = document.createRange();
  range.selectNodeContents(element);

  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);

  return selection;
}

/**
 * Replaces the editor's contents with `text`, the way fillIn would for an
 * ordinary field.
 */
export function typeable(selector, userOptions = {}) {
  return getter(function () {
    return async (text) => {
      const element = findOne(this, selector, userOptions);

      selectContents(element);

      element.dispatchEvent(
        new InputEvent('beforeinput', {
          inputType: 'insertText',
          data: text,
          bubbles: true,
          cancelable: true,
        }),
      );

      await settled();

      return this;
    };
  });
}

/**
 * Selects everything in the editor, so a toolbar button has something to act on.
 */
export function selectableContents(selector, userOptions = {}) {
  return getter(function () {
    return async () => {
      const element = findOne(this, selector, userOptions);

      selectContents(element);
      document.dispatchEvent(new Event('selectionchange'));

      await settled();

      return this;
    };
  });
}

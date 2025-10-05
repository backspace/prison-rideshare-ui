import {
  clickable,
  collection,
  create,
  isVisible,
  text,
  visitable,
} from 'ember-cli-page-object';
import { findOne } from 'ember-cli-page-object/extend';
import { getter } from 'ember-cli-page-object/macros';

function resolveElement(context, selector, pageObjectKey) {
  const scopedSelector = selector ?? '';
  return findOne(context, scopedSelector, { pageObjectKey });
}

function isDisabled(selector) {
  return getter(function (pageObjectKey) {
    const element = resolveElement(this, selector, pageObjectKey);
    return element.disabled ?? element.getAttribute('disabled') !== null;
  });
}

function isChecked(selector) {
  return getter(function (pageObjectKey) {
    const element = resolveElement(this, selector, pageObjectKey);
    return element.checked ?? element.getAttribute('checked') !== null;
  });
}

export default create({
  visit: visitable('/users'),

  users: collection('[data-test-user-row]', {
    email: text('[data-test-user-email]'),
    lastSeenAt: text('[data-test-user-last-seen]'),
    isPresent: isVisible('[data-test-user-present-icon]'),
    presenceCount: text('[data-test-user-presence-count]'),

    adminCheckbox: {
      scope: '[data-test-user-admin-toggle]',
      checked: isChecked(),
      click: clickable(),
      isDisabled: isDisabled(),
    },
  }),
});

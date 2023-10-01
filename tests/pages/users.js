import {
  clickable,
  collection,
  create,
  hasClass,
  isVisible,
  text,
  visitable,
} from 'ember-cli-page-object';
import { findOne } from 'ember-cli-page-object/extend';
import { getter } from 'ember-cli-page-object/macros';

function isDisabled(selector) {
  return getter(function (pageObjectKey) {
    return (
      findOne(this, selector, { pageObjectKey }).getAttribute('disabled') ===
      'disabled'
    );
  });
}

export default create({
  visit: visitable('/users'),

  users: collection('tbody tr.user', {
    email: text('.email'),
    lastSeenAt: text('.last-seen'),
    isPresent: isVisible('.present md-icon'),
    presenceCount: text('.present .count'),

    adminCheckbox: {
      scope: 'md-checkbox',
      checked: hasClass('md-checked'),
      click: clickable(),
      isDisabled: isDisabled(),
    },
  }),
});

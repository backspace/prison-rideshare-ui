import {
  clickable,
  collection,
  create,
  hasClass,
  is,
  isVisible,
  text,
  visitable,
} from 'ember-cli-page-object';

export default create({
  visit: visitable('/users'),

  users: collection('tbody tr.user', {
    email: text('.email'),
    isPresent: isVisible('.present md-icon'),
    presenceCount: text('.present .count'),

    adminCheckbox: {
      scope: 'md-checkbox',
      checked: hasClass('md-checked'),
      click: clickable(),
      isDisabled: is('[disabled]'),
    },
  }),
});

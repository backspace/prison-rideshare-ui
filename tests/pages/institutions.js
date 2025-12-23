import {
  clickable,
  collection,
  create,
  isVisible,
  text,
  visitable,
} from 'ember-cli-page-object';

export default create({
  visit: visitable('/institutions'),
  newInstitution: clickable('[data-test-new-institution]'),

  institutions: collection('[data-test-institution-row]', {
    name: text('[data-test-institution-name]'),
    isFar: isVisible('[data-test-institution-far]'),

    edit: clickable('[data-test-institution-edit]'),
  }),

  form: {
    scope: '[data-test-institution-modal]',

    nameField: {
      scope: '[data-test-institution-name-field]',
    },

    farField: {
      scope: '[data-test-institution-far-checkbox]',
    },

    submit: clickable('[data-test-institution-submit]'),
    cancel: clickable('[data-test-institution-cancel]'),
  },
});

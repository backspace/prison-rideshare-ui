import {
  clickable,
  collection,
  create,
  hasClass,
  isVisible,
  text,
  visitable,
} from 'ember-cli-page-object';

export default create({
  visit: visitable('/institutions'),
  newInstitution: clickable('button.new'),

  institutions: collection('tbody tr.institution', {
    name: text('.name'),
    isFar: isVisible('.far md-icon'),

    edit: clickable('button.edit'),
  }),

  form: {
    nameField: {
      scope: '.name input',
    },

    farField: {
      scope: 'md-checkbox',
      isChecked: hasClass('md-checked'),
    },

    submit: clickable('button.submit'),
    cancel: clickable('button.cancel'),
  },
});

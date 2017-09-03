import {
  clickable,
  collection,
  create,
  text,
  visitable
} from 'ember-cli-page-object';

export default create({
  visit: visitable('/institutions'),

  institutions: collection({
    itemScope: 'tbody tr.institution',

    item: {
      name: text('.name'),
      rate: text('.rate'),

      edit: clickable('button.edit')
    }
  }),

  form: {
    nameField: {
      scope: '.name input'
    },

    rateField: {
      scope: '.rate input'
    },

    submit: clickable('button.submit'),
    cancel: clickable('button.cancel')
  }
});

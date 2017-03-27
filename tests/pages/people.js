import {
  clickable,
  collection,
  create,
  fillable,
  text,
  visitable
} from 'ember-cli-page-object';

export default create({
  visit: visitable('/drivers'),
  newPerson: clickable('button.new'),

  people: collection({
    itemScope: 'tbody tr.person',

    item: {
      name: text('.name'),
      edit: clickable('button.edit')
    }
  }),

  form: {
    nameField: {
      scope: '.name input',
      fill: fillable()
    },

    submit: clickable('button.submit'),
    cancel: clickable('button.cancel')
  }
});

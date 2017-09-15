import {
  attribute,
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

      email: {
        scope: '.email',
        href: attribute('href', 'a')
      },

      landline: {
        scope: '.landline',
        href: attribute('href', 'a')
      },

      mobile: {
        scope: '.mobile',
        href: attribute('href', 'a')
      },

      notes: {
        scope: '.notes'
      },

      edit: clickable('button.edit')
    }
  }),

  form: {
    nameField: {
      scope: '.name input',
      fill: fillable()
    },

    nameError: {
      scope: '.name .paper-input-error'
    },

    submit: clickable('button.submit'),
    cancel: clickable('button.cancel')
  }
});

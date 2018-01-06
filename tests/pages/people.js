import {
  attribute,
  clickable,
  collection,
  create,
  fillable,
  hasClass,
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
        href: attribute('href', 'a'),
        isPreferred: hasClass('is-preferred'),
      },

      landline: {
        scope: '.landline',
        href: attribute('href', 'a'),
        isPreferred: hasClass('is-preferred'),
      },

      mobile: {
        scope: '.mobile',
        href: attribute('href', 'a'),
        isPreferred: hasClass('is-preferred'),
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

    // TODO rule of three?
    email: {
      scope: '.email',
      field: {
        scope: 'input'
      },
      desiredMedium: {
        scope: 'md-radio-button'
      },
      error: {
        scope: '.paper-input-error'
      }
    },

    mobile: {
      scope: '.mobile',
      field: {
        scope: 'input'
      },
      desiredMedium: {
        scope: 'md-radio-button'
      },
      error: {
        scope: '.paper-input-error'
      }
    },

    notes: {
      scope: '.notes',
      field: {
        scope: 'textarea'
      }
    },

    submit: clickable('button.submit'),
    cancel: clickable('button.cancel')
  }
});

import {
  attribute,
  clickable,
  collection,
  create,
  fillable,
  hasClass,
  isVisible,
  text,
  visitable
} from 'ember-cli-page-object';

export default create({
  visit: visitable('/rides'),
  newRide: clickable('button.new'),

  head: {
    cancelledSwitch: {
      scope: '.paper-switch.cancelled',
      enabled: hasClass('md-checked'),
      click: clickable('.md-thumb')
    },

    completedSwitch: {
      scope: '.paper-switch.completed',
      enabled: hasClass('md-checked'),
      click: clickable('.md-thumb')
    }
  },

  rides: collection({
    itemScope: 'tbody tr.ride',

    item: {
      enabled: hasClass('enabled'),
      isUncombinable: hasClass('uncombinable'),

      cancellation: {
        scope: '.cancellation',
        click: clickable('button'),
        showsLockdown: isVisible('button md-icon[md-font-icon=lock]'),
        showsVisitor: isVisible('button md-icon[md-font-icon="perm identity"]'),
        showsNotCancelled: isVisible('button md-icon[md-font-icon="highlight off"]'),
        showsOther: isVisible('button md-icon[md-font-icon="help"]'),

        title: attribute('title', 'button')
      },

      name: text('.name'),
      date: text('.date'),
      institution: text('.institution'),
      address: text('.address'),
      contact: text('.contact'),
      passengers: text('.passengers'),

      driver: {
        scope: '.driver',
        text: text('.ember-power-select-selected-item'),
        click: clickable()
      },

      carOwner: {
        scope: '.car-owner',
        text: text('.ember-power-select-selected-item'),
        click: clickable()
      },

      combineButton: {
        scope: 'button.combine',
        isActive: hasClass('md-raised'),
        title: attribute('title')
      },

      isCombined: isVisible('.driver-and-car-owner md-icon[md-font-icon="call split"]'),

      edit: clickable('button.edit')
    },

    head: {
      scope: 'thead',
      clickDate: clickable('.date')
    }
  }),

  notes: collection({
    itemScope: 'tr.notes',

    item: {
      text: text('td.notes')
    }
  }),

  reports: collection({
    itemScope: 'tr.report',

    item: {
      distance: text('.distance'),
      foodExpenses: text('.food-expenses'),
      notes: text('.notes')
    }
  }),

  form: {
    scope: '.md-dialog-container',

    notice: text('.md-toolbar-tools'),

    timespan: {
      scope: '.timespan textarea'
    },

    start: {
      scope: '.start input'
    },

    end: {
      scope: '.end input'
    },

    name: {
      scope: 'md-autocomplete',

      fillIn: fillable('input'),

      suggestions: collection({
        resetScope: true,
        itemScope: '.ember-power-select-option',

        item: {
          name: text('.name'),
          address: text('address'),
          contact: text('.contact')
        }
      })
    },

    nameError: {
      scope: 'md-autocomplete .paper-input-error'
    },

    address: {
      scope: '.address input',
    },

    contact: {
      scope: '.contact input',
    },

    passengers: {
      scope: '.passengers input',
    },

    notes: {
      scope: '.request-notes textarea',
    },

    submit: clickable('button.submit'),
    cancel: clickable('button.cancel')
  },

  cancellationForm: {
    scope: '.md-dialog-container',

    cancelled: {
      scope: 'md-checkbox',
      checked: hasClass('md-checked'),
      click: clickable()
    },

    reason: {
      value: text('.ember-power-select-selected-item')
    },

    other: {
      scope: '.md-input',
    },

    save: clickable('button.submit')
  }
});

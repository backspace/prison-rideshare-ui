import {
  attribute,
  clickable,
  collection,
  create,
  fillable,
  hasClass,
  isVisible,
  text,
  triggerable,
  value,
  visitable
} from 'ember-cli-page-object';

export default create({
  visit: visitable('/rides'),
  newRide: clickable('button.new'),

  head: {
    cancelledSwitch: {
      scope: '.paper-switch.cancelled',
      enabled: hasClass('md-checked'),
      click: triggerable('keypress', '.md-container', { eventProperties: { keyCode: 13 } })
    },

    completedSwitch: {
      scope: '.paper-switch.completed',
      enabled: hasClass('md-checked'),
      click: triggerable('keypress', '.md-container', { eventProperties: { keyCode: 13 } })
    },

    search: {
      scope: 'md-input-container.search',

      fillIn: fillable('input'),
      value: value('input'),

      clear: {
        scope: 'button'
      }
    }
  },

  rides: collection({
    itemScope: 'tbody tr.ride',

    item: {
      enabled: hasClass('enabled'),
      isUncombinable: hasClass('uncombinable'),

      isDivider: hasClass('divider'),

      cancellation: {
        scope: '.cancellation',
        click: clickable('button'),
        showsLockdown: isVisible('button md-icon[md-font-icon=lock]'),
        showsVisitor: isVisible('button md-icon[md-font-icon="perm identity"]'),
        showsNotCancelled: isVisible('button md-icon[md-font-icon="highlight off"]'),
        showsOther: isVisible('button md-icon[md-font-icon="help"]'),

        title: attribute('title', 'button')
      },

      name: text('.name-and-contact .name'),
      isFirstTimer: isVisible('.name-and-contact md-icon[md-font-icon=announcement]'),
      date: text('.date'),
      clickDate: clickable('.date-cell'),
      institution: text('.institution'),
      address: text('.address'),
      contact: text('.contact'),
      contactPhoneHref: attribute('href', '.contact a'),
      passengers: text('.passengers'),

      medium: {
        scope: '.medium-and-contact',
        isTxt: isVisible('md-icon[md-font-icon=textsms]'),
        isEmail: isVisible('md-icon[md-font-icon=email]'),
        isPhone: isVisible('md-icon[md-font-icon=phone]')
      },

      driver: {
        scope: '.driver',
        text: text('.name'),
        click: clickable(),
        reveal: clickable('.name-container'),
        clear: clickable('.remove-container button'),

        email: text('.email'),
        landline: text('.landline'),

        selfNotes: text('.self-notes')
      },

      carOwner: {
        scope: '.car-owner',
        text: text('.name'),
        click: clickable(),
        clear: clickable('.remove-container button')
      },

      combineButton: {
        scope: 'button.combine',
        isActive: hasClass('md-raised'),
        title: attribute('title')
      },

      isCombined: isVisible('.driver-and-car-owner md-icon[md-font-icon="call split"]'),

      edit: clickable('button.edit'),

      creationDate: {
        scope: '.creation'
      }
    },

    head: {
      scope: 'thead',
      clickDate: clickable('.date')
    }
  }),

  noMatchesRow: {
    scope: 'tr.no-matches'
  },

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
      notes: text('.notes'),

      clear: clickable('button'),
      clearConfirm: { scope: '.clear-confirm' },
      clearCancel: { scope: '.clear-cancel' }
    }
  }),

  form: {
    scope: '.md-dialog-container',

    notice: text('.warning'),

    timespan: {
      scope: '.timespan textarea'
    },

    timespanResult: {
      scope: '.timespan-result input'
    },

    medium: {
      scope: '.medium-row',
      txt: { scope: '.txt' },
      email: { scope: '.email' },
      phone: { scope: '.phone' }
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

    firstTime: {
      scope: 'md-checkbox',
      checked: hasClass('md-checked'),
      click: clickable()
    },

    firstTimePoints: {
      scope: '.first-time-points'
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

    notice: text('md-card-content'),

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

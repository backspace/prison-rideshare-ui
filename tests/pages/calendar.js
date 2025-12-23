import {
  attribute,
  clickable,
  collection,
  create,
  fillable,
  hasClass,
  isVisible,
  property,
  text,
  value,
  visitable,
} from 'ember-cli-page-object';
import { getter } from 'ember-cli-page-object/macros';

export default create({
  visit: visitable('/calendar/:month'),
  adminVisit: visitable('/admin-calendar/:month'),

  personSession: text('[data-test-person-session]'),

  person: {
    scope: '[data-test-person-card]',

    toggle: {
      scope: '[data-test-person-toggle]',
      click: clickable(),
    },

    name: {
      scope: '[data-test-person-name-field]',
      field: {
        scope: '[data-test-person-name-input]',
        validationState: attribute('data-validation-state'),
        isError: getter(function () {
          return this.validationState === 'invalid';
        }),
      },
      error: {
        scope: '[data-test-person-name-error]',
        text: text(),
      },
    },

    activeSwitch: {
      scope: '[data-test-person-active]',
      enabled: property('checked'),
      click: clickable(),
    },

    email: {
      scope: '[data-test-person-email-field]',
      field: {
        scope: '[data-test-person-email-input]',
        isDisabled: property('disabled'),
      },
      error: {
        scope: '[data-test-person-email-error]',
        text: text(),
      },
      desiredMedium: {
        resetScope: true,
        scope: '[data-test-person-medium-radio="email"]',
        isChecked: property('checked'),
      },
    },

    mobile: {
      scope: '[data-test-person-mobile-field]',
      field: {
        scope: '[data-test-person-mobile-input]',
        value: value(),
        fillIn: fillable(),
      },
      error: {
        scope: '[data-test-person-mobile-error]',
        text: text(),
      },
      desiredMedium: {
        scope: '[data-test-person-medium-radio="mobile"]',
        isChecked: property('checked'),
      },
    },

    landline: {
      scope: '[data-test-person-landline-field]',
      field: {
        scope: '[data-test-person-landline-input]',
        value: value(),
        fillIn: fillable(),
      },
      error: {
        scope: '[data-test-person-landline-error]',
        text: text(),
      },
    },

    selfNotes: {
      scope: '[data-test-person-self-notes-field]',
      field: {
        scope: '[data-test-person-self-notes-field]',
        value: value(),
        fillIn: fillable(),
      },
    },

    address: {
      scope: '[data-test-person-address-field]',
      field: {
        scope: '[data-test-person-address-field]',
        value: value(),
        fillIn: fillable(),
      },
    },

    cancelButton: {
      scope: '[data-test-person-cancel]',
      click: clickable(),
    },

    submitButton: {
      scope: '[data-test-person-save]',
      click: clickable(),
      isHighlighted: hasClass('hds-button--color-primary'),
    },
  },

  subscription: {
    scope: '.subscription',

    link: {
      scope: 'a:first',
      href: attribute('href'),
    },
  },

  month: text('.ember-power-calendar-nav-title'),

  nextMonth: {
    scope: '.ember-power-calendar-nav-control.next-month',
  },

  previousMonth: {
    scope: '.ember-power-calendar-nav-control.previous-month',
  },

  days: collection('.ember-power-calendar-day', {
    slots: collection('[data-test-calendar-slot]', {
      click: clickable('[data-test-slot-checkbox]'),
      checkbox: { scope: '[data-test-slot-checkbox]' },
      hours: text('[data-test-slot-hours]'),

      count: {
        scope: '[data-test-slot-count]',
        isVisible: isVisible(),
        isCommittedTo: hasClass('committed-to'),
      },

      isCommittedTo: property('checked', '[data-test-slot-checkbox]'),
      isDisabled: property('disabled', '[data-test-slot-checkbox]'),
      isHidden: hasClass('hidden'),
    }),
  }),

  viewingSlot: text('.viewing-slot .hours'),

  people: collection('[data-test-commitment]', {
    name: text('[data-test-commitment-reveal]'),
    reveal: clickable('[data-test-commitment-reveal]'),

    email: text('[data-test-commitment-email]'),

    remove: clickable('[data-test-commitment-remove]'),
  }),

  peopleSearch: {
    scope: '[data-test-commitment-search-input]',

    options: collection('[data-test-commitment-option]', { resetScope: true }),
  },

  error: text('.error'),
});

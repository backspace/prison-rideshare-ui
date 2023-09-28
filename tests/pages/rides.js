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
  visitable,
} from 'ember-cli-page-object';

import reasonToIcon from 'prison-rideshare-ui/utils/reason-to-icon';

export default create({
  visit: visitable('/rides'),
  newRide: clickable('button.new'),

  head: {
    cancelledSwitch: {
      scope: '.paper-switch.cancelled',
      enabled: hasClass('md-checked'),
      click: triggerable('keypress', '.md-container', {
        eventProperties: { keyCode: 13 },
      }),
    },

    completedSwitch: {
      scope: '.paper-switch.completed',
      enabled: hasClass('md-checked'),
      click: triggerable('keypress', '.md-container', {
        eventProperties: { keyCode: 13 },
      }),
    },

    search: {
      scope: 'md-input-container.search',

      fillIn: fillable('input'),
      value: value('input'),

      clear: {
        scope: 'button',
        click: triggerable('click'),
      },
    },
  },

  ridesHead: {
    scope: 'thead',
    clickDate: clickable('.date'),
  },

  rides: collection('tbody tr.ride', {
    enabled: hasClass('enabled'),
    isUncombinable: hasClass('uncombinable'),
    isHighlighted: hasClass('highlighted'),

    isDivider: hasClass('divider'),

    cancellation: {
      scope: '.cancellation',
      click: clickable('button'),
      showsLockdown: isVisible(
        `button md-icon[md-font-icon='${reasonToIcon['lockdown']}']`
      ),
      showsVisitor: isVisible(
        `button md-icon[md-font-icon='${reasonToIcon['visitor']}']`
      ),
      showsDriverNotFound: isVisible(
        `button md-icon[md-font-icon='${reasonToIcon['driver not found']}']`
      ),
      showsNotCancelled: isVisible(
        'button md-icon[md-font-icon="highlight off"]'
      ),
      showsOther: isVisible('button md-icon[md-font-icon="help"]'),

      title: attribute('title', 'button'),
    },

    name: text('.name-and-contact .name'),
    isFirstTimer: isVisible(
      '.name-and-contact md-icon[md-font-icon=announcement]'
    ),
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
      isPhone: isVisible('md-icon[md-font-icon=phone]'),
    },

    driver: {
      scope: '.driver',
      text: text('.name'),
      click: clickable(),
      reveal: clickable('.name-container'),
      clear: clickable('.remove-container button'),

      email: text('.email'),
      landline: text('.landline'),

      selfNotes: text('.self-notes'),
    },

    carOwner: {
      scope: '.car-owner',
      text: text('.name'),
      click: clickable(),
      clear: clickable('.remove-container button'),

      select: {
        scope: 'md-select',
        type: triggerable('keydown'),
        enter: triggerable('keydown', '.md-power-select-options', {
          testContainer: 'html',
          resetScope: true,
          eventProperties: { keyCode: 13 },
        }),
      },
    },

    isOverridable: isVisible('md-icon[md-font-icon=directions_bus]'),

    combineButton: {
      scope: 'button.combine',
      isActive: hasClass('md-raised'),
      title: attribute('title'),
    },

    isCombined: isVisible(
      '.driver-and-car-owner md-icon[md-font-icon="call split"]'
    ),

    edit: clickable('button.edit'),

    creationDate: {
      scope: '.creation',
    },
  }),

  noMatchesRow: {
    scope: 'tr.no-matches',
  },

  notes: collection('tr.notes', {
    text: text('td.notes'),
  }),

  reports: collection('tr.report', {
    distance: text('.distance'),
    carExpenses: text('.car-expenses'),
    rate: text('.rate'),
    foodExpenses: text('.food-expenses'),
    notes: text('.notes'),

    clear: clickable('button'),
    clearConfirm: { scope: '.clear-confirm' },
    clearCancel: { scope: '.clear-cancel' },
  }),

  overlaps: collection('tr.overlap', {
    text: text('.text'),
    assign: clickable('.assign'),
    ignore: clickable('.ignore'),
  }),

  confirmationNotifications: collection('tr.confirmation-notification', {
    text: text('.text'),
    medium: {
      scope: '.medium',
      isTxt: isVisible('md-icon[md-font-icon=textsms]'),
      isEmail: isVisible('md-icon[md-font-icon=email]'),
      isPhone: isVisible('md-icon[md-font-icon=phone]'),
    },
    markConfirmed: clickable('.mark-confirmed'),
  }),

  form: {
    testContainer: 'md-dialog',

    notice: text('.editing-warning'),

    timespan: {
      scope: '.timespan textarea',
    },

    timespanResult: {
      scope: '.timespan-result',
      value: value('input'),
      hasWarning: isVisible('.timespan-warning'),
    },

    timespanOverrideButton: {
      scope: '[data-test-timespan-override-button]',
    },

    timespanStart: {
      scope: '[data-test-timespan-start] input',
    },

    timespanEnd: {
      scope: '[data-test-timespan-end] input',
    },

    timespanEndError: {
      scope: '[data-test-timespan-end] .paper-input-error',
    },

    medium: {
      scope: '.medium-row',
      txt: { scope: '.txt' },
      email: { scope: '.email' },
      phone: { scope: '.phone' },
    },

    requestConfirmed: {
      scope: 'md-checkbox.request-confirmed',
      checked: hasClass('md-checked'),
      click: clickable(),
    },

    overridable: {
      scope: 'md-checkbox.overridable',
      checked: hasClass('md-checked'),
      click: clickable(),
    },

    name: {
      scope: 'md-autocomplete',

      fillIn: fillable('input'),

      suggestions: collection('.ember-power-select-option', {
        testContainer: '.ember-power-select-options',
        resetScope: true,

        name: text('.name'),
        address: text('address'),
        contact: text('.contact'),
      }),
    },

    nameError: {
      scope: 'md-autocomplete .paper-input-error',
    },

    institutionError: {
      scope: '.institution .paper-input-error',
    },

    address: {
      scope: '.address input',
    },

    contact: {
      scope: '.contact input',
    },

    firstTime: {
      scope: 'md-checkbox.first-time',
      checked: hasClass('md-checked'),
      click: clickable(),
    },

    firstTimePoints: {
      scope: '.first-time-points',
    },

    passengers: {
      scope: '.passengers input',
    },

    notes: {
      scope: '.request-notes textarea',
    },

    submit: clickable('button.submit'),
    cancel: clickable('button.cancel'),
  },

  cancellationForm: {
    testContainer: 'md-dialog',

    notice: text('md-card-content'),

    shortcutButtons: collection('button.shortcut'),

    cancelled: {
      scope: 'md-checkbox',
      checked: hasClass('md-checked'),
      click: clickable(),
    },

    reason: {
      value: text('.ember-power-select-selected-item'),
    },

    other: {
      scope: '.md-input',
    },

    save: clickable('button.submit'),
  },
});

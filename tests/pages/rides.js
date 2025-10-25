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
  triggerable,
  value,
  visitable,
} from 'ember-cli-page-object';
import { getter } from 'ember-cli-page-object/macros';

export default create({
  visit: visitable('/rides'),
  newRide: clickable('[data-test-new-ride]'),

  head: {
    cancelledSwitch: {
      scope: '[data-test-show-cancelled]',
      enabled: property('checked'),
    },

    completedSwitch: {
      scope: '[data-test-show-completed]',
      enabled: property('checked'),
    },

    search: {
      scope: '[data-test-ride-search]',

      fillIn: fillable(),
      value: value(),

      clear: {
        scope: '[data-test-ride-search-clear]',
        click: clickable(),
      },
    },
  },

  ridesHead: {
    scope: '[data-test-rides-head-date]',
    clickDate: clickable('button'),
  },

  rides: collection('tbody tr.ride', {
    enabled: hasClass('enabled'),
    isUncombinable: hasClass('uncombinable'),
    isHighlighted: hasClass('highlighted'),
    isDivider: hasClass('divider'),

    cancellation: {
      scope: '[data-test-cancellation-button]',
      state: attribute('data-cancellation-state'),
      title: attribute('title'),
      showsLockdown: getter(function () {
        return this.state === 'lockdown';
      }),
      showsVisitor: getter(function () {
        return this.state === 'visitor';
      }),
      showsDriverNotFound: getter(function () {
        return this.state === 'driver not found';
      }),
      showsNotCancelled: getter(function () {
        return this.state === 'not-cancelled';
      }),
      showsOther: getter(function () {
        return this.state === 'other!';
      }),
    },

    name: text('[data-test-ride-name]'),
    isFirstTimer: isVisible('[data-test-ride-first-time]'),
    date: text('[data-test-ride-date]'),
    clickDate: clickable('[data-test-ride-date-cell]'),
    institution: text('[data-test-ride-institution]'),
    address: text('[data-test-ride-address]'),
    contact: text('[data-test-ride-contact]'),
    contactPhoneHref: attribute('href', '[data-test-ride-contact] a'),

    medium: {
      scope: '[data-test-ride-medium]',
      medium: attribute('data-medium'),
      isTxt: getter(function () {
        return this.medium === 'txt';
      }),
      isEmail: getter(function () {
        return this.medium === 'email';
      }),
      isPhone: getter(function () {
        return this.medium === 'phone';
      }),
    },

    driver: {
      scope: '[data-test-driver]',
      text: text('[data-test-person-badge-name]'),
      click: clickable(),
      reveal: clickable('[data-test-person-badge-toggle]'),
      clear: clickable('[data-test-person-badge-clear]'),

      email: text('[data-test-person-badge-email]'),
      landline: text('[data-test-person-badge-landline]'),
      selfNotes: text('[data-test-person-badge-self-notes]'),
    },

    carOwner: {
      scope: '[data-test-car-owner]',
      text: text('[data-test-person-badge-name]'),
      click: clickable(),
      clear: clickable('[data-test-person-badge-clear]'),

      select: {
        click: clickable(),
        type: triggerable('keydown'),
        enter: triggerable('keydown', '.ember-basic-dropdown-trigger', {
          testContainer: 'html',
          resetScope: true,
          eventProperties: { keyCode: 13 },
        }),
      },
    },

    isOverridable: isVisible('[data-test-overridable-indicator]'),

    combineButton: {
      scope: '[data-test-combine-button]',

      activeAttribute: attribute('data-active'),
      isActive: getter(function () {
        return this.activeAttribute === 'true';
      }),

      title: attribute('title'),
    },

    isCombined: hasClass('combined'),

    edit: clickable('[data-test-edit-ride]'),

    creationDate: {
      scope: '[data-test-ride-creation]',
    },
  }),

  noMatchesRow: {
    scope: '[data-test-no-matches]',
  },

  notes: collection('[data-test-notes-row]', {
    text: text('[data-test-notes]'),
  }),

  reports: collection('tr.report', {
    distance: text('[data-test-report-distance]'),
    carExpenses: text('[data-test-report-car-expenses]'),
    rate: text('[data-test-report-rate]'),
    foodExpenses: text('[data-test-report-food]'),
    notes: text('[data-test-report-notes]'),

    clear: clickable('[data-test-report-clear]'),
    clearConfirm: { scope: '[data-test-report-clear-confirm]' },
    clearCancel: { scope: '[data-test-report-clear-cancel]' },
  }),

  overlaps: collection('tr.overlap', {
    text: text('[data-test-overlap-text]'),
    assign: clickable('[data-test-overlap-assign]'),
    ignore: clickable('[data-test-overlap-ignore]'),
  }),

  confirmationNotifications: collection('[data-test-confirmation-row]', {
    text: text('[data-test-confirmation-text]'),
    markConfirmed: clickable('[data-test-confirmation-mark]'),
  }),

  form: {
    testContainer: '[data-test-ride-form]',

    notice: text('[data-test-editing-warning]'),

    timespan: {
      scope: '[data-test-timespan]',
    },

    timespanResult: {
      scope: '[data-test-timespan-result]',
      value: value('input'),
      hasWarning: isVisible('[data-test-timespan-warning]'),
    },

    timespanOverrideButton: {
      scope: '[data-test-timespan-override-button]',
      isDisabled: property('disabled'),
    },

    timespanStart: {
      scope: '[data-test-timespan-start]',
    },

    timespanEnd: {
      scope: '[data-test-timespan-end]',
    },

    timespanEndError: {
      scope: '[data-test-timespan-end-error]',
    },

    medium: {
      txt: {
        scope: '[data-test-medium-txt]',
      },
      email: {
        scope: '[data-test-medium-email]',
      },
      phone: {
        scope: '[data-test-medium-phone]',
      },
    },

    requestConfirmed: {
      scope: '[data-test-request-confirmed]',
      checked: property('checked'),
    },

    overridable: {
      scope: '[data-test-overridable]',
      checked: property('checked'),
    },

    name: {
      scope: '[data-test-visitor-select]',

      searchInput: {
        scope: '.ember-power-select-search-input',
        resetScope: true,
      },

      async fillIn(value) {
        await this.click();
        await this.searchInput.fillIn(value);
      },

      suggestions: collection('.ember-power-select-option', {
        testContainer: '.ember-power-select-options',
        resetScope: true,

        name: text('.name'),
        address: text('address'),
        contact: text('.contact'),
      }),
    },

    nameError: {
      scope: '[data-test-name-error]',
    },

    institutionError: {
      scope: '[data-test-institution-error]',
    },

    address: {
      scope: '[data-test-address]',
    },

    contact: {
      scope: '[data-test-contact]',
    },

    firstTime: {
      scope: '[data-test-first-time]',
      checked: property('checked'),
    },

    firstTimePoints: {
      scope: '[data-test-first-time-points]',
    },

    passengers: {
      scope: '[data-test-passengers]',
    },

    notes: {
      scope: '[data-test-request-notes]',
    },

    submit: clickable('[data-test-ride-form-submit]'),
    cancel: clickable('[data-test-ride-form-cancel]'),
  },

  cancellationForm: {
    testContainer: '[data-test-cancellation-form]',

    notice: text('[data-test-cancellation-notice]'),

    shortcutButtons: collection('[data-test-cancellation-shortcut]'),

    cancelled: {
      scope: '[data-test-cancellation-cancelled]',
      checked: property('checked'),
      click: clickable(),
    },

    reason: {
      scope: '[data-test-cancellation-reason-select]',
    },

    other: {
      scope: '[data-test-cancellation-other]',
    },

    save: clickable('[data-test-cancellation-form-save]'),
  },
});

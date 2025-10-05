import {
  attribute,
  clickable,
  collection,
  create,
  fillable,
  hasClass,
  isVisible,
  text,
  visitable,
} from 'ember-cli-page-object';
import { findOne } from 'ember-cli-page-object/extend';
import { getter } from 'ember-cli-page-object/macros';

function resolveElement(context, selector, pageObjectKey) {
  const scopedSelector = selector ?? '';
  return findOne(context, scopedSelector, { pageObjectKey });
}

function isDisabled(selector) {
  return getter(function (pageObjectKey) {
    const element = resolveElement(this, selector, pageObjectKey);
    return element.disabled ?? element.getAttribute('disabled') !== null;
  });
}

function isChecked(selector) {
  return getter(function (pageObjectKey) {
    const element = resolveElement(this, selector, pageObjectKey);
    return element.checked ?? element.getAttribute('checked') !== null;
  });
}

export default create({
  visit: visitable('/drivers'),
  newPerson: clickable('[data-test-new-driver]'),

  head: {
    inactiveSwitch: {
      scope: '[data-test-drivers-inactive-toggle]',
      enabled: isChecked(),
      click: clickable(),
    },
  },

  people: collection('[data-test-driver-row]', {
    activeSwitch: {
      scope: '[data-test-driver-active-toggle]',
      enabled: isChecked(),
      click: clickable(),
    },

    name: text('[data-test-driver-name]'),

    email: {
      scope: '[data-test-driver-email]',
      text: text(),
      href: attribute('href', '[data-test-driver-email-link]'),
      isPreferred: hasClass('is-preferred'),
    },

    landline: {
      scope: '[data-test-driver-landline]',
      text: text(),
      href: attribute('href', '[data-test-driver-landline-link]'),
      isPreferred: hasClass('is-preferred'),
    },

    mobile: {
      scope: '[data-test-driver-mobile]',
      text: text(),
      href: attribute('href', '[data-test-driver-mobile-link]'),
      isPreferred: hasClass('is-preferred'),
    },

    lastRide: {
      scope: '[data-test-driver-last-ride]',
      text: text(),
    },

    notes: {
      scope: '[data-test-driver-notes]',
      text: text(),
    },

    copyButton: {
      scope: '[data-test-driver-copy-button]',
      clipboardText: attribute('data-clipboard-text'),
      isVisible: isVisible(),
    },

    edit: clickable('[data-test-driver-edit]'),
  }),

  form: {
    scope: '[data-test-driver-modal]',

    nameField: {
      fill: fillable('[data-test-driver-form-name-input]'),
      value: attribute('value', '[data-test-driver-form-name-input]'),
    },

    nameError: {
      scope: '[data-test-driver-form-name-error]',
      text: text(),
    },

    email: {
      fill: fillable('[data-test-driver-form-email-input]'),
      field: {
        scope: '[data-test-driver-form-email-input]',
      },
      desiredMedium: clickable('[data-test-driver-form-medium-email]'),
      error: {
        scope: '[data-test-driver-form-email-error]',
        text: text(),
      },
    },

    mobile: {
      fill: fillable('[data-test-driver-form-mobile-input]'),
      field: {
        scope: '[data-test-driver-form-mobile-input]',
      },
      desiredMedium: clickable('[data-test-driver-form-medium-mobile]'),
    },

    landline: {
      fill: fillable('[data-test-driver-form-landline-input]'),
      field: {
        scope: '[data-test-driver-form-landline-input]',
      },
      desiredMedium: clickable('[data-test-driver-form-medium-landline]'),
    },

    address: {
      fill: fillable('[data-test-driver-form-address-input]'),
      field: {
        scope: '[data-test-driver-form-address-input]',
        value: attribute('value'),
      },
    },

    notes: {
      fill: fillable('[data-test-driver-form-notes-input]'),
      field: {
        scope: '[data-test-driver-form-notes-input]',
      },
    },

    submit: clickable('[data-test-driver-form-submit]'),
    cancel: clickable('[data-test-driver-form-cancel]'),
  },
});

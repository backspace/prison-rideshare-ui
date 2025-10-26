import { clickable, create, text } from 'ember-cli-page-object';

export default create({
  session: {
    scope: '[data-test-session]',
    click: clickable('[data-test-session-button]'),
    text: text('[data-test-session-button]'),
  },

  toast: {
    scope: '[data-test-toast]',
    text: text('[data-test-toast-text]'),
  },

  inlineAlert: {
    scope: '[data-test-inline-alert]',
    text: text('[data-test-inline-alert-text]'),
  },

  userCount: {
    scope: '[data-test-nav-users-count]',
    text: text(),
  },

  logCount: {
    scope: '[data-test-nav-log-count]',
    text: text(),
  },

  ridesBadge: {
    scope: '[data-test-nav-rides-count]',
    text: text(),
  },
});

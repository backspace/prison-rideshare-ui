import { attribute, clickable, create, text } from 'ember-cli-page-object';

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

  sidebarToggle: {
    scope: '[data-test-sidebar-toggle]',
  },

  sidebarToggleBadge: {
    scope: '[data-test-sidebar-toggle-badge]',
  },

  sidebar: {
    scope: '[data-test-app-sidenav]',
  },

  sidebarState: attribute('data-state', '[data-test-app-sidenav]'),
  sidebarNavReportLink: { scope: '[data-test-nav-report]' },

  userCount: {
    scope: '[data-test-nav-users-count]',
  },

  logCount: {
    scope: '[data-test-nav-log-count]',
  },

  ridesBadge: {
    scope: '[data-test-nav-rides-count]',
  },
});

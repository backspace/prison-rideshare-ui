import { clickable, create } from 'ember-cli-page-object';

export default create({
  session: {
    scope: '.site-nav-container .session',
    click: clickable('button'),
  },

  toast: {
    scope: '.md-toast-content span',
    testContainer: 'md-toast',
  },

  userCount: {
    scope: '.users .count',
  },

  logCount: {
    scope: '.log .count',
  },

  ridesBadge: {
    scope: '.rides .count',
  },
});

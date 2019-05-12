import { clickable, create, text } from 'ember-cli-page-object';

export default create({
  title: text('title:nth-of-type(2)', { testContainer: 'html' }),

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

  overlapCount: {
    scope: '.rides .count',
  },
});

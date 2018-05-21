import {
  collection,
  create,
  text
} from 'ember-cli-page-object';

export default create({
  title: text('title:nth-of-type(2)', { testContainer: 'html' }),

  session: {
    scope: '.site-nav-container .session'
  },

  flashes: collection('.flashes div', {
    text: text()
  }),

  toast: {
    scope: '.md-toast-content span'
  },

  userCount: {
    scope: '.users .count'
  }
});

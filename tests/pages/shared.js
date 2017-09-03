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

  flashes: collection({
    itemScope: '.flashes div',

    item: {
      text: text()
    }
  }),

  toast: {
    scope: '.md-toast-content span'
  }
});

import {
  collection,
  create,
  text
} from 'ember-cli-page-object';

export default create({
  session: {
    scope: '.site-nav-container .session'
  },

  flashes: collection({
    itemScope: '.flashes div',

    item: {
      text: text()
    }
  })
});

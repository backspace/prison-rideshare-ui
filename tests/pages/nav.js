import {
  create,
} from 'ember-cli-page-object';

export default create({
  scope: '.site-nav-container',

  session: {
    scope: '.session'
  }
});

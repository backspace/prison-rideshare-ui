import {
  create,
  text
} from 'ember-cli-page-object';

export default create({
  scope: '.site-nav-container',
  session: text('.session')
});

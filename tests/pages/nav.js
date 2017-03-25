import {
  clickable,
  create,
  isHidden,
  text
} from 'ember-cli-page-object';

export default create({
  scope: '.site-nav-container',
  session: text('.session'),
  logOut: clickable('.session'),
  isLoggedOut: isHidden('.session')
});

import {
  clickable,
  create,
  fillable,
  visitable
} from 'ember-cli-page-object';

export default create({
  visit: visitable('/register'),

  fillEmail: fillable('.email input'),
  fillPassword: fillable('.password input'),
  fillPasswordConfirmation: fillable('.password-confirmation input'),

  submit: clickable('button'),
});

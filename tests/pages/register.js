import {
  clickable,
  create,
  fillable,
  text,
  visitable,
} from 'ember-cli-page-object';

export default create({
  testContainer: 'md-dialog',

  visit: visitable('/register'),

  fillEmail: fillable('.email input'),
  fillPassword: fillable('.password input'),
  fillPasswordConfirmation: fillable('.password-confirmation input'),

  error: text('.error'),

  submit: clickable('button'),
});

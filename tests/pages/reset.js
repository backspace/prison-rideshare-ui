import {
  clickable,
  create,
  fillable,
  text,
  visitable,
} from 'ember-cli-page-object';

export default create({
  testContainer: 'md-dialog',

  visit: visitable('/reset/:token'),

  fillPassword: fillable('.password input'),
  fillPasswordConfirmation: fillable('.password-confirmation input'),

  error: text('.error'),

  submit: clickable('button'),
});

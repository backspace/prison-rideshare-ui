import {
  clickable,
  create,
  fillable,
  text,
  visitable,
} from 'ember-cli-page-object';

export default create({
  testContainer: '[data-test-register-card]',

  visit: visitable('/register'),

  fillEmail: fillable('[data-test-register-email]'),
  fillPassword: fillable('[data-test-register-password]'),
  fillPasswordConfirmation: fillable(
    '[data-test-register-password-confirmation]'
  ),

  error: text('[data-test-register-error]'),

  submit: clickable('[data-test-register-submit]'),
});

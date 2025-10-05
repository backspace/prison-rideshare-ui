import {
  clickable,
  create,
  fillable,
  text,
  visitable,
} from 'ember-cli-page-object';

export default create({
  testContainer: '[data-test-login-card]',

  visit: visitable('/login'),

  fillEmail: fillable('[data-test-login-email]'),
  fillPassword: fillable('[data-test-login-password]'),

  error: text('[data-test-login-error]'),

  submit: clickable('[data-test-login-submit]'),
});

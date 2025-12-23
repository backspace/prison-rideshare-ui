import {
  clickable,
  create,
  fillable,
  text,
  visitable,
} from 'ember-cli-page-object';

export default create({
  visit: visitable('/reset/:token'),

  fillPassword: fillable('[data-test-reset-password]'),
  fillPasswordConfirmation: fillable('[data-test-reset-password-confirmation]'),

  error: text('[data-test-reset-error]'),

  submit: clickable('[data-test-reset-submit]'),
});

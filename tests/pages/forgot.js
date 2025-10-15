import {
  clickable,
  create,
  fillable,
  text,
  visitable,
} from 'ember-cli-page-object';

export default create({
  testContainer: '[data-test-forgot-modal]',

  scope: '[data-test-forgot-form]',

  visit: visitable('/forgot'),

  fillEmail: fillable('[data-test-forgot-email]'),

  error: text('[data-test-forgot-error]'),

  submit: clickable('[data-test-forgot-submit]'),
});

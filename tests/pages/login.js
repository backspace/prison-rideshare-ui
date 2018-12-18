import {
  clickable,
  create,
  fillable,
  text,
  visitable,
} from 'ember-cli-page-object';

export default create({
  visit: visitable('/login'),

  fillEmail: fillable('.email input', { testContainer: 'html' }),
  fillPassword: fillable('.password input', { testContainer: 'html' }),

  error: text('.error', { testContainer: 'html' }),

  submit: clickable('button.login', { testContainer: 'html' }),
});

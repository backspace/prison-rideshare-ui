import {
  clickable,
  create,
  fillable,
  text,
  visitable
} from 'ember-cli-page-object';

export default create({
  visit: visitable('/login'),

  fillEmail: fillable('.email input'),
  fillPassword: fillable('.password input'),

  error: text('.error'),

  submit: clickable('button'),
});

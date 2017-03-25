import {
  clickable,
  create,
  fillable,
  visitable
} from 'ember-cli-page-object';

export default create({
  visit: visitable('/login'),

  fillEmail: fillable('.email input'),
  fillPassword: fillable('.password input'),

  submit: clickable('button'),
});

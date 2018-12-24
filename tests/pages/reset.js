import {
  clickable,
  create,
  fillable,
  text,
  visitable,
} from 'ember-cli-page-object';

export default create({
  testContainer: 'md-dialog',

  visit: visitable('/reset'),

  fillEmail: fillable('.email input'),

  error: text('.error'),

  submit: clickable('button'),
});

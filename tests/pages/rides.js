import {
  clickable,
  collection,
  create,
  fillable,
  text,
  visitable
} from 'ember-cli-page-object';

export default create({
  visit: visitable('/rides'),
  newRide: clickable('a'),

  rides: collection({
    itemScope: 'li',

    item: {
      name: text('.name'),
      date: text('.date'),
      times: text('.times')
    }
  }),

  form: {
    fillDate: fillable('input.date'),
    fillStart: fillable('input.start'),
    fillEnd: fillable('input.end'),
    fillName: fillable('input.name'),

    submit: clickable('button')
  }
});

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
  newRide: clickable('button.new'),

  rides: collection({
    itemScope: 'tbody tr',

    item: {
      name: text('.name'),
      date: text('.date'),
      institution: text('.institution'),
      address: text('.address'),
      contact: text('.contact'),
      passengers: text('.passengers'),

      driver: text('.driver'),
      carOwner: text('.car-owner')
    },

    head: {
      scope: 'thead',
      clickDate: clickable('.date')
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

import {
  clickable,
  collection,
  create,
  fillable,
  hasClass,
  text,
  visitable
} from 'ember-cli-page-object';

export default create({
  visit: visitable('/rides'),
  newRide: clickable('button.new'),

  rides: collection({
    itemScope: 'tbody tr.ride',

    item: {
      enabled: hasClass('enabled'),

      switch: {
        scope: '.paper-switch',
        enabled: hasClass('md-checked'),
        click: clickable()
      },

      name: text('.name'),
      date: text('.date'),
      institution: text('.institution'),
      address: text('.address'),
      contact: text('.contact'),
      passengers: text('.passengers'),

      driver: text('.driver'),
      carOwner: text('.car-owner'),

      edit: clickable('button.edit')
    },

    head: {
      scope: 'thead',
      clickDate: clickable('.date')
    }
  }),

  form: {
    fillDate: fillable('.date input'),
    fillStart: fillable('.start input'),
    fillEnd: fillable('.end input'),
    fillName: fillable('.name input'),
    fillAddress: fillable('.address input'),
    fillContact: fillable('.contact input'),
    fillPassengers: fillable('.passengers input'),

    submit: clickable('button.submit'),
    cancel: clickable('button.cancel')
  }
});

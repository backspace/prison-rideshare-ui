import {
  clickable,
  collection,
  create,
  fillable,
  hasClass,
  isVisible,
  text,
  value,
  visitable
} from 'ember-cli-page-object';

export default create({
  visit: visitable('/rides'),
  newRide: clickable('button.new'),

  head: {
    cancelledSwitch: {
      scope: '.paper-switch.cancelled',
      enabled: hasClass('md-checked'),
      click: clickable('.md-thumb')
    },

    completedSwitch: {
      scope: '.paper-switch.completed',
      enabled: hasClass('md-checked'),
      click: clickable('.md-thumb')
    }
  },

  rides: collection({
    itemScope: 'tbody tr.ride',

    item: {
      enabled: hasClass('enabled'),

      cancellation: {
        scope: '.cancellation',
        click: clickable('button'),
        showsLockdown: isVisible('button md-icon[md-font-icon=lock]'),
        showsVisitor: isVisible('button md-icon[md-font-icon="perm identity"]'),
        showsNotCancelled: isVisible('button md-icon[md-font-icon=delete]')
      },

      name: text('.name'),
      date: text('.date'),
      institution: text('.institution'),
      address: text('.address'),
      contact: text('.contact'),
      passengers: text('.passengers'),

      driver: {
        scope: '.driver',
        text: text(),
        click: clickable()
      },

      carOwner: {
        scope: '.car-owner',
        text: text(),
        click: clickable()
      },

      isCombined: isVisible('.driver md-icon[md-font-icon="merge type"]'),

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
    passengersValue: value('.passengers input'),

    fillNotes: fillable('.request-notes textarea'),

    submit: clickable('button.submit'),
    cancel: clickable('button.cancel')
  },

  cancellationForm: {
    scope: '.md-dialog-container',

    cancelled: {
      scope: 'md-checkbox',
      checked: hasClass('md-checked'),
      click: clickable()
    },

    reason: {
      value: text('.ember-power-select-selected-item')
    },
    save: clickable('button.submit')
  }
});

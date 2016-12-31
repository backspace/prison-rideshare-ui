import {
  clickable,
  collection,
  create,
  fillable,
  is,
  text,
  value,
  visitable
} from 'ember-cli-page-object';

export default create({
  visit: visitable('/reports/new'),

  rides: collection({
    itemScope: 'md-radio-button',

    item: {
      label: text('.md-label span'),
      choose: clickable()
    }
  }),

  fillDistance: fillable('.distance input'),
  fillFoodExpenses: fillable('.food-expenses input'),
  fillNotes: fillable('.report-notes textarea'),
  notesValue: value('.report-notes textarea'),

  submitButton: {
    scope: 'button.submit',
    disabled: is('[disabled]'),
    click: clickable()
  }
});

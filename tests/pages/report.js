import {
  clickable,
  collection,
  create,
  fillable,
  text,
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

  submit: clickable('button.submit')
});

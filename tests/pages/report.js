import {
  clickable,
  collection,
  create,
  property,
  text,
  visitable,
} from 'ember-cli-page-object';
import { findOne } from 'ember-cli-page-object/extend';
import { getter } from 'ember-cli-page-object/macros';

function isDisabled(selector) {
  return getter(function (pageObjectKey) {
    return (
      findOne(this, selector, { pageObjectKey }).getAttribute('disabled') ===
      'disabled'
    );
  });
}

export default create({
  visit: visitable('/reports/new'),

  rides: collection('md-radio-button', {
    label: text('.md-label > span'),
    choose: clickable(),
  }),

  noRides: { scope: '.no-rides' },
  noSession: { scope: '.no-session' },

  distance: { scope: '.distance input' },
  carExpenses: { scope: '.car-expenses input' },
  foodExpenses: { scope: '.food-expenses input' },
  notes: { scope: '.report-notes textarea' },
  donation: {
    scope: 'md-checkbox',
  },

  submitButton: {
    scope: 'button.submit',
    disabled: isDisabled(),
    click: clickable(),
  },
});

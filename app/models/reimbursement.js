/* eslint-disable ember/no-classic-classes*/
import Model, { attr, belongsTo } from '@ember-data/model';
import dollars from 'prison-rideshare-ui/utils/dollars';

export default Model.extend({
  foodExpenses: attr('number', { defaultValue: 0 }),
  carExpenses: attr('number', { defaultValue: 0 }),

  person: belongsTo(),
  donation: attr('boolean'),
  processed: attr('boolean'),

  foodExpensesDollars: dollars('foodExpenses'),
  carExpensesDollars: dollars('carExpenses'),

  ride: belongsTo(),

  insertedAt: attr('date'),
});

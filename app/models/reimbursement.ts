import DS from 'ember-data';
import dollars from 'prison-rideshare-ui/utils/dollars';

export default class Reimbursement extends DS.Model.extend({
  foodExpenses: DS.attr('number', {defaultValue: 0}),
  carExpenses: DS.attr('number', {defaultValue: 0}),

  person: DS.belongsTo('person'),
  donation: DS.attr('boolean'),
  processed: DS.attr('boolean'),

  foodExpensesDollars: dollars('foodExpenses'),
  carExpensesDollars: dollars('carExpenses'),

  ride: DS.belongsTo('ride'),

  insertedAt: DS.attr('date')
}) {}

declare module 'ember-data' {
  interface ModelRegistry {
    reimbursement: Reimbursement
  }
}

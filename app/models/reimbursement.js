import DS from 'ember-data';
import dollars from 'prison-rideshare-ui/utils/dollars';

export default DS.Model.extend({
  // FIXME this is going away!
  amount: DS.attr('number'),

  foodExpenses: DS.attr('number', {defaultValue: 0}),
  carExpenses: DS.attr('number', {defaultValue: 0}),

  person: DS.belongsTo(),
  donation: DS.attr('boolean'),

  amountDollars: dollars('amount'),

  foodExpensesDollars: dollars('foodExpenses'),
  carExpensesDollars: dollars('carExpenses')
});

import DS from 'ember-data';
import dollars from 'prison-rideshare-ui/utils/dollars';

export default DS.Model.extend({
  amount: DS.attr('number'),
  person: DS.belongsTo(),
  donation: DS.attr('boolean'),

  amountDollars: dollars('amount')
});

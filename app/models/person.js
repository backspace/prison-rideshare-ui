import Ember from 'ember';
import DS from 'ember-data';

import dollars from 'prison-rideshare-ui/utils/dollars';

export default DS.Model.extend({
  name: DS.attr(),

  reimbursements: DS.hasMany(),

  reimbursementAmounts: Ember.computed.mapBy('reimbursements', 'amount'),
  reimbursementTotal: Ember.computed.sum('reimbursementAmounts'),
  reimbursementTotalDollars: dollars('reimbursementTotal'),

  drivings: DS.hasMany('ride', {inverse: 'driver'}),

  foodExpenseAmounts: Ember.computed.mapBy('drivings', 'foodExpenses'),
  foodExpensesTotal: Ember.computed.sum('foodExpenseAmounts'),
  foodExpensesTotalDollars: dollars('foodExpensesTotal'),

  carOwnings: DS.hasMany('ride', {inverse: 'carOwner'}),

  carExpenseAmounts: Ember.computed.mapBy('carOwnings', 'carExpenses'),
  carExpensesTotal: Ember.computed.sum('carExpenseAmounts'),
  carExpensesTotalDollars: dollars('carExpensesTotal'),

  owed: Ember.computed('reimbursementTotal', 'foodExpensesTotal', 'carExpensesTotal', function() {
    return ((this.get('carExpensesTotal') || 0) + (this.get('foodExpensesTotal') || 0)) - this.get('reimbursementTotal');
  }),

  owedDollars: dollars('owed')
});

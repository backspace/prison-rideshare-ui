import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr(),

  reimbursements: DS.hasMany(),

  reimbursementAmounts: Ember.computed.mapBy('reimbursements', 'amount'),
  reimbursementTotal: Ember.computed.sum('reimbursementAmounts'),

  drivings: DS.hasMany('ride', {inverse: 'driver'}),

  foodExpenseAmounts: Ember.computed.mapBy('drivings', 'foodExpenses'),
  foodExpensesTotal: Ember.computed.sum('foodExpenseAmounts'),

  carOwnings: DS.hasMany('ride', {inverse: 'carOwner'}),

  carExpenseAmounts: Ember.computed.mapBy('carOwnings', 'carExpenses'),
  carExpensesTotal: Ember.computed.sum('carExpenseAmounts'),

  owed: Ember.computed('reimbursementTotal', 'foodExpensesTotal', 'carExpensesTotal', function() {
    return ((this.get('carExpensesTotal') || 0) + (this.get('foodExpensesTotal') || 0)) - this.get('reimbursementTotal');
  })
});

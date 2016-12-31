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

  owed: Ember.computed('reimbursementTotal', 'foodExpensesTotal', function() {
    return this.get('foodExpensesTotal') - this.get('reimbursementTotal');
  })
});

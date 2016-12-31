import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr(),

  reimbursements: DS.hasMany(),

  reimbursementAmounts: Ember.computed.mapBy('reimbursements', 'amount'),
  reimbursementTotal: Ember.computed.sum('reimbursementAmounts'),

  owed: Ember.computed('reimbursementTotal', function() {
    return this.get('reimbursementTotal')*-1;
  })
});

import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr(),

  reimbursements: DS.hasMany(),

  drivings: DS.hasMany('ride', {inverse: 'driver'}),
  carOwnings: DS.hasMany('ride', {inverse: 'carOwner'})
});

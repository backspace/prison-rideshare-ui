import { Model, belongsTo, hasMany } from 'ember-cli-mirage';

export default Model.extend({
  institution: belongsTo(),

  driver: belongsTo('person', { inverse: 'drivings' }),
  carOwner: belongsTo('person', { inverse: 'carOwnings' }),

  combinedWith: belongsTo('ride', { inverse: 'children' }),
  children: hasMany('ride', { inverse: 'combinedWith' }),

  reimbursements: hasMany(),
  debt: hasMany(),

  commitments: hasMany(),
});

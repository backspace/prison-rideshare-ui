import { Model, hasMany } from 'ember-cli-mirage';

export default Model.extend({
  reimbursements: hasMany(),

  drivings: hasMany('ride', { inverse: 'driver' }),
  carOwnings: hasMany('ride', { inverse: 'carOwner' }),
});

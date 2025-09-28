import { Model, hasMany } from 'miragejs';

export default Model.extend({
  reimbursements: hasMany(),

  drivings: hasMany('ride', { inverse: 'driver' }),
  carOwnings: hasMany('ride', { inverse: 'carOwner' }),
});

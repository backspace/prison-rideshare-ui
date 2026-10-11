import { Model, hasMany } from 'miragejs';

export default Model.extend({
  reimbursements: hasMany(),

  visitings: hasMany('ride', { inverse: 'visitor' }),

  drivings: hasMany('ride', { inverse: 'driver' }),
  carOwnings: hasMany('ride', { inverse: 'carOwner' }),
});

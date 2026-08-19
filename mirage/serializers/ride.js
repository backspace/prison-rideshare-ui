import { JSONAPISerializer } from 'miragejs';

export default JSONAPISerializer.extend({
  include: Object.freeze([
    'institution',
    'visitor',
    'driver',
    'carOwner',
    'children',
    'reimbursements',
    'commitments',
  ]),
});

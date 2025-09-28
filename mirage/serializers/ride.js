import { JSONAPISerializer } from 'miragejs';

export default JSONAPISerializer.extend({
  include: Object.freeze([
    'institution',
    'driver',
    'carOwner',
    'children',
    'reimbursements',
    'commitments',
  ]),
});

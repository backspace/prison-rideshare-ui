import { JSONAPISerializer } from 'ember-cli-mirage';

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

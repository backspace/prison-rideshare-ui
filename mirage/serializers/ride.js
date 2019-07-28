import { JSONAPISerializer } from 'ember-cli-mirage';

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

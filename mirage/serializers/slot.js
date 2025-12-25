import { JSONAPISerializer } from 'miragejs';

export default JSONAPISerializer.extend({
  include: Object.freeze(['commitments']),
  alwaysIncludeLinkageData: true,
});

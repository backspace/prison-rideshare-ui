import { Model, belongsTo } from 'miragejs';

export default Model.extend({
  person: belongsTo(),
  slot: belongsTo(),
});

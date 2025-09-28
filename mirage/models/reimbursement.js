import { Model, belongsTo } from 'miragejs';

export default Model.extend({
  ride: belongsTo(),
  person: belongsTo(),
});

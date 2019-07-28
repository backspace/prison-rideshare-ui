import { Model, belongsTo } from 'ember-cli-mirage';

export default Model.extend({
  ride: belongsTo(),
  person: belongsTo(),
});

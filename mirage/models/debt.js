import { Model, belongsTo, hasMany } from 'miragejs';

export default Model.extend({
  person: belongsTo(),
  rides: hasMany(),
});

import { Model, belongsTo } from 'miragejs';

export default Model.extend({
  poster: belongsTo('user'),
});

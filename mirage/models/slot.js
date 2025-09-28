import { Model, hasMany } from 'miragejs';

export default Model.extend({
  commitments: hasMany(),
});

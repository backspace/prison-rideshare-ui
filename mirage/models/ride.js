import { Model, belongsTo, hasMany } from 'ember-cli-mirage';

export default Model.extend({
  institution: belongsTo(),

  driver: belongsTo('person'),
  carOwner: belongsTo('person'),

  combinedWith: belongsTo('ride'),
  children: hasMany('ride')
});

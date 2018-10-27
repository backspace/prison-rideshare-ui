import DS from 'ember-data';

export default DS.Model.extend({
  body: DS.attr(),

  poster: DS.belongsTo('user'),

  insertedAt: DS.attr('date')
});

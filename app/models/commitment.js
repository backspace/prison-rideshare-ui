import DS from 'ember-data';

export default DS.Model.extend({
  slot: DS.belongsTo({ async: false })
});

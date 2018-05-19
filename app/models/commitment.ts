import DS from 'ember-data';

export default class Commitment extends DS.Model.extend({
  slot: DS.belongsTo('slot', { async: false }),
  person: DS.belongsTo('person')
}) {}

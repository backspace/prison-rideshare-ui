/* eslint-disable ember/no-classic-classes, ember/use-ember-data-rfc-395-imports */
import DS from 'ember-data';

export default DS.Model.extend({
  slot: DS.belongsTo({ async: false }),
  person: DS.belongsTo(),
});

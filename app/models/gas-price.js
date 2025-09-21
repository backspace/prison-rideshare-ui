/* eslint-disable ember/no-classic-classes, ember/use-ember-data-rfc-395-imports */
import DS from 'ember-data';

export default DS.Model.extend({
  price: DS.attr(),
  closeRate: DS.attr(),
  farRate: DS.attr(),

  insertedAt: DS.attr('date'),
});

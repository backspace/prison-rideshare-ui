/* eslint-disable ember/no-classic-classes*/
import Model, { attr } from '@ember-data/model';

export default Model.extend({
  price: attr(),
  closeRate: attr(),
  farRate: attr(),

  insertedAt: attr('date'),
});

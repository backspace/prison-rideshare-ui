/* eslint-disable ember/no-classic-classes */
import Model, { belongsTo } from '@ember-data/model';

export default Model.extend({
  slot: belongsTo({ async: false }),
  person: belongsTo(),
});

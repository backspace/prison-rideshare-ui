import DS from 'ember-data';
import dollars from 'prison-rideshare-ui/utils/dollars';

export default DS.Model.extend({
  name: DS.attr(),
  rate: DS.attr('number'),

  rateDollars: dollars('rate'),
});

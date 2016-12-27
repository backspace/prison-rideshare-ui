import { Factory } from 'ember-cli-mirage';

export default Factory.extend({
  name(i) { return `Person ${i}`; },

  start: new Date(2016, 11, 26, 20, 30),
  end: new Date(2016, 11, 26, 22, 0)
});

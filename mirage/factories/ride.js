import { Factory } from 'ember-cli-mirage';

export default Factory.extend({
  name(i) { return `Person ${i}`; },

  start(i) { return new Date(2016, 11, 26, 20, 30 + i); },
  end: new Date(2016, 11, 26, 22, 0)
});

import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  name(i) { return `Person ${i}`; },
  address() { return faker.address.streetAddress(); },
  contact() { return Math.random() < 0.2 ? faker.internet.email() : faker.phone.phoneNumber(); },
  passengers() { return faker.random.arrayElement([1,1,1,1,1,2,3]); },

  start(i) { return new Date(2016, 11, 26, 20, 30 + i); },
  end: new Date(2016, 11, 26, 22, 0)
});

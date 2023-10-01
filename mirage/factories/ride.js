import { Factory } from 'ember-cli-mirage';

import { faker } from '@faker-js/faker';
faker.seed(1919);

export default Factory.extend({
  name() {
    return faker.person.firstName();
  },
  address() {
    return faker.location.streetAddress();
  },
  contact() {
    return Math.random() < 0.2 ? faker.internet.email() : faker.phone.number();
  },

  passengers: 1,

  start(i) {
    return new Date(2016, 11, 26, 20, 30 + i);
  },
  end() {
    return new Date(2016, 11, 26, 22, 0);
  },
  complete() {
    return false;
  },
  requestConfirmed: true,
});

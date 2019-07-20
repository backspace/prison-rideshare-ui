import { Factory } from 'ember-cli-mirage';

import faker from 'faker';
faker.seed(1919);

export default Factory.extend({
  name() {
    return faker.name.firstName();
  },
  email() {
    return faker.internet.email();
  },
  mobile() {
    return faker.phone.phoneNumber();
  },
  active: true,
});

import { Factory } from 'miragejs';

import { faker } from '@faker-js/faker';
faker.seed(1919);

export default Factory.extend({
  name() {
    return faker.person.firstName();
  },
  email() {
    return faker.internet.email();
  },
  mobile() {
    return faker.phone.number();
  },
  active: true,
});

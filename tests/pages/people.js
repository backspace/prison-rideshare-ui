import {
  collection,
  create,
  text,
  visitable
} from 'ember-cli-page-object';

export default create({
  visit: visitable('/people'),

  people: collection({
    itemScope: 'tbody tr.person',

    item: {
      name: text('.name')
    }
  })
});

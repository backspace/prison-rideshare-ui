import {
  collection,
  create,
  text,
  visitable
} from 'ember-cli-page-object';

export default create({
  visit: visitable('/institutions'),

  institutions: collection({
    itemScope: 'tbody tr.institution',

    item: {
      name: text('.name'),
      rate: text('.rate')
    }
  })
});

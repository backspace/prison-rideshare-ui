import {
  collection,
  create,
  text,
  visitable
} from 'ember-cli-page-object';

export default create({
  visit: visitable('/log'),

  posts: collection('.posts tbody tr', {
    date: text('.date'),
    poster: text('.poster'),
    content: text('.content'),
  }),
});

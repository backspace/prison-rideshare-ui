import { JSONAPISerializer } from 'miragejs';

export default JSONAPISerializer.extend({
  typeKeyForModel() {
    // FIXME why is this necessary?
    return 'user';
  },
});

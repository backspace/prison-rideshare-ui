import { JSONAPISerializer } from 'ember-cli-mirage';

export default JSONAPISerializer.extend({
  typeKeyForModel() {
    // FIXME why is this necessary?
    return 'user';
  }
});

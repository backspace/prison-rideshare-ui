import Controller from '@ember/controller';

import { alias } from '@ember/object/computed';

export default Controller.extend({
  slots: alias('model.slots'),
  person: alias('model.person')
});

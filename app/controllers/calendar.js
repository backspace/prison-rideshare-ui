import Controller from '@ember/controller';

import { alias } from '@ember/object/computed';

export default Controller.extend({
  month: alias('model.month'),
  slots: alias('model.slots'),
  person: alias('model.person'),

  actions: {
    savePerson() {
      this.get('person').save();
    }
  }
});

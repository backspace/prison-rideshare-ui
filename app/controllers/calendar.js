import Controller from '@ember/controller';

import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Controller.extend({
  toasts: service(),

  month: alias('model.month'),
  slots: alias('model.slots'),
  person: alias('model.person'),

  actions: {
    savePerson() {
      this.get('person').save().then(() => {
        this.get('toasts').show('Saved your details');
        this.set('showPerson', false);
      }).catch(() => {
        this.get('toasts').show('Couldn’t save your details');
      })
    }
  }
});

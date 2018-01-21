import Controller from '@ember/controller';

import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Controller.extend({
  toasts: service(),

  month: alias('model.month'),
  slots: alias('model.slots'),
  person: alias('model.person'),

  subscriptionUrl: computed('person.{id,calendarSecret}', function() {
    const person = this.get('person');

    const base = person.store.adapterFor('person').buildURL('person', person.id);
    const webcalBase = base.replace('https', 'webcal').replace('http', 'webcal');

    return `${webcalBase}/calendar?secret=${encodeURIComponent(person.get('calendarSecret'))}`;
  }),

  actions: {
    cancel() {
      this.set('showPerson', false);
      this.get('person').rollbackAttributes();
    },

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

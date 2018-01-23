import Controller from '@ember/controller';

import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';

import { task } from 'ember-concurrency';

export default Controller.extend({
  toasts: service(),

  month: alias('model.month'),
  slots: alias('model.slots'),
  person: alias('model.person'),

  httpSubscriptionUrl: computed('person.{id,calendarSecret}', function() {
    const person = this.get('person');

    const base = person.store.adapterFor('person').buildURL('person', person.id);

    return `${base}/calendar?secret=${encodeURIComponent(person.get('calendarSecret'))}`;
  }),

  webcalSubscriptionUrl: computed('httpSubscriptionUrl', function() {
    return this.get('httpSubscriptionUrl').replace('https', 'webcal').replace('http', 'webcal')
  }),

  savePerson: task(function * () {
    try {
      yield this.get('person').save();

      this.get('toasts').show('Saved your details');
      this.set('showPerson', false);
    } catch (e) {
      this.get('toasts').show('Couldn’t save your details');
    }
  }).drop(),

  actions: {
    cancel() {
      this.set('showPerson', false);
      this.get('person').rollbackAttributes();
    }
  }
});

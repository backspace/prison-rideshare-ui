import Controller from '@ember/controller';

import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';

import moment from 'moment';
import { task } from 'ember-concurrency';

export default Controller.extend({
  toasts: service(),

  month: alias('model.month'),
  slots: alias('model.slots'),
  person: alias('model.person'),

  monthMoment: computed('month', function() {
    return moment(this.month);
  }),

  httpSubscriptionUrl: computed('person.{id,calendarSecret}', function() {
    const person = this.person;

    const base = person.store
      .adapterFor('person')
      .buildURL('person', person.id);

    return `${base}/calendar?secret=${encodeURIComponent(person.get('calendarSecret'))}`;
  }),

  webcalSubscriptionUrl: computed('httpSubscriptionUrl', function() {
    return this.httpSubscriptionUrl
      .replace('https', 'webcal')
      .replace('http', 'webcal');
  }),

  savePerson: task(function*() {
    try {
      yield this.person.save();

      this.toasts.show('Saved your details');
      this.set('showPerson', false);
    } catch (e) {
      this.toasts.show('Couldn’t save your details');
    }
  }).drop(),

  actions: {
    cancel() {
      this.set('showPerson', false);
      this.person.rollbackAttributes();
    },
  },
});

import CalendarController from './calendar';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { setDiff } from '@ember/object/computed';
import { A } from '@ember/array';
import fetch from 'fetch';
import moment from 'moment';
import { computed } from '@ember/object';

export default CalendarController.extend({
  peopleService: service('people'),
  activePeople: alias('peopleService.active'),

  router: service(),
  session: service(),
  store: service(),
  toasts: service(),

  monthString: computed('month', function() {
    return moment(this.get('month')).format('YYYY-MM');
  }),

  init() {
    this._super(...arguments);
    this.set('people', A());
  },

  remainingPeople: setDiff('activePeople', 'people'),

  actions: {
    addPerson(person) {
      this.get('people').pushObject(person);
    },

    removePerson(person) {
      this.get('people').removeObject(person);
    },

    email() {
      const token = this.get('session.data.authenticated.access_token');

      this.get('people').forEach(person => {
        const url = `${person.store.adapterFor('person').buildURL('person', person.id)}/calendar-email/${this.get('monthString')}`;
        fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).then(() => {
          this.get('toasts').show(`Sent to ${person.get('name')}`);
          this.get('people').removeObject(person);
        });
      });
    }
  }
});

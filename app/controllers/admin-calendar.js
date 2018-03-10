import CalendarController from './calendar';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { setDiff } from '@ember/object/computed';
import { A } from '@ember/array';
import fetch from 'fetch';
import moment from 'moment';
import { computed } from '@ember/object';
import RSVP from 'rsvp';

const format = 'YYYY-MM';

export default CalendarController.extend({
  peopleService: service('people'),
  activePeople: alias('peopleService.active'),

  router: service(),
  session: service(),
  store: service(),
  toasts: service(),

  previousMonth: computed('month', function() {
    return moment(this.get('month')).add(-1, 'M').format(format);
  }),

  nextMonth: computed('month', function() {
    return moment(this.get('month')).add(1, 'M').format(format);
  }),

  monthString: computed('month', function() {
    return moment(this.get('month')).format(format);
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

    addAllActive() {
      this.get('people').addObjects(this.get('activePeople'));
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
    },

    fetchLinks() {
      const token = this.get('session.data.authenticated.access_token');

      const personLinkRequests = this.get('people').reduce((hash, person) => {
        const url = `${person.store.adapterFor('person').buildURL('person', person.id)}/calendar-link/${this.get('monthString')}`;

        hash[person.get('email')] = fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        return hash;
      }, {});

      RSVP.hash(personLinkRequests).then(linkFetches => {
        return RSVP.hash(Object.keys(linkFetches).reduce((hash, email) => {
          hash[email] = linkFetches[email].text();
          return hash;
        }, {}));
      }).then(links => {
        this.set('links', links);
        this.set('linksError', undefined);
      }).catch(e => {
        this.set('links', undefined);
        this.set('linksError', e);
      });
    }
  }
});

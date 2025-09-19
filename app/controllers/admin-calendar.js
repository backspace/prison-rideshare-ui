import classic from 'ember-classic-decorator';
import { inject as service } from '@ember/service';
import CalendarController from './calendar';
import { alias, mapBy, setDiff, sum } from '@ember/object/computed';
import { A } from '@ember/array';
import fetch from 'fetch';
import moment from 'moment';
import { get, action, computed } from '@ember/object';
import RSVP from 'rsvp';

const format = 'YYYY-MM';

@classic
export default class AdminCalendarController extends CalendarController {
  @service('people')
  peopleService;

  @alias('peopleService.active')
  activePeople;

  @mapBy('model.slots', 'commitments')
  slotCommitments;

  @mapBy('slotCommitments', 'length')
  slotCommitmentLengths;

  @sum('slotCommitmentLengths')
  commitmentCount;

  @service
  router;

  @service
  session;

  @service
  store;

  @service
  toasts;

  @computed('month')
  get previousMonth() {
    return moment(this.month).add(-1, 'M').format(format);
  }

  @computed('month')
  get nextMonth() {
    return moment(this.month).add(1, 'M').format(format);
  }

  @computed('month')
  get monthString() {
    return moment(this.month).format(format);
  }

  @computed('month')
  get monthMoment() {
    return moment(this.month);
  }

  @computed('month')
  get title() {
    return `${moment(this.month).format('MMMM YYYY')} calendar`;
  }

  init() {
    super.init(...arguments);
    this.set('people', A());
  }

  @setDiff('activePeople', 'people')
  remainingPeople;

  @mapBy('viewingSlot.commitments', 'person')
  viewingSlotPeople;

  @mapBy('viewingSlotPeople', 'id')
  viewingSlotPeopleIds;

  @computed('activePeople.[]', 'viewingSlotPeopleIds.[]')
  get uncommittedPeople() {
    const alreadyCommittedPeople = this.viewingSlotPeopleIds;
    return this.activePeople.reject((person) =>
      alreadyCommittedPeople.includes(person.id)
    );
  }

  @action
  addPerson(person) {
    this.people.pushObject(person);
  }

  @action
  addAllActive() {
    this.people.addObjects(this.activePeople);
  }

  @action
  removePerson(person) {
    this.people.removeObject(person);
  }

  @action
  createCommitment(person) {
    const slot = this.viewingSlot;
    const commitment = this.store.createRecord('commitment', {
      slot: this.viewingSlot,
      person: person,
    });

    commitment
      .save()
      .then(() => {
        this.toasts.show(
          `Committed ${person.get('name')} to drive on ${moment(
            slot.get('start')
          ).format('MMMM D')}`
        );
      })
      .catch((error) => {
        const errorDetail = get(error, 'errors.firstObject.detail');
        this.toasts.show(errorDetail || 'Couldn’t save your change');
      });
  }

  @action
  deleteCommitment(commitment) {
    let name = commitment.get('person.name');
    let date = moment(commitment.get('slot.start')).format('MMMM D');

    commitment
      .destroyRecord()
      .then(() => {
        this.toasts.show(`Deleted ${name}’s commitment on ${date}`);
      })
      .catch((error) => {
        const errorDetail = get(error, 'errors.firstObject.detail');
        this.toasts.show(errorDetail || 'Couldn’t save your change');
      });
  }

  @action
  email() {
    const token = this.get('session.data.authenticated.access_token');

    this.people.forEach((person) => {
      const url = `${person.store
        .adapterFor('person')
        .buildURL('person', person.id)}/calendar-email/${this.monthString}`;
      fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then(() => {
        this.toasts.show(`Sent to ${person.get('name')}`);
        this.people.removeObject(person);
      });
    });
  }

  @action
  fetchLinks() {
    const token = this.get('session.data.authenticated.access_token');

    const personLinkRequests = this.people.reduce((hash, person) => {
      const url = `${person.store
        .adapterFor('person')
        .buildURL('person', person.id)}/calendar-link/${this.monthString}`;

      hash[person.get('email')] = fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return hash;
    }, {});

    RSVP.hash(personLinkRequests)
      .then((linkFetches) => {
        return RSVP.hash(
          Object.keys(linkFetches).reduce((hash, email) => {
            hash[email] = linkFetches[email].text();
            return hash;
          }, {})
        );
      })
      .then((links) => {
        const linkObjects = Object.keys(links).map((email) => {
          return { email, link: links[email] };
        });
        this.set('links', linkObjects);
        this.set('linksError', undefined);
      })
      .catch((e) => {
        this.set('links', undefined);
        this.set('linksError', e);
      });
  }
}

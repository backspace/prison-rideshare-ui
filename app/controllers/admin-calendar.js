import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import CalendarController from './calendar';
import fetch from 'fetch';
import moment from 'moment-timezone';
import RSVP from 'rsvp';

const format = 'YYYY-MM';

export default class AdminCalendarController extends CalendarController {
  @service('people')
  peopleService;

  @service
  router;

  @service
  session;

  @service
  store;

  @service
  toasts;

  @tracked people = [];
  @tracked links = undefined;
  @tracked linksError = undefined;
  @tracked viewingSlot = null;
  @tracked errorMessage = undefined;

  get activePeople() {
    return this.peopleService.active ?? [];
  }

  get commitmentCount() {
    const slots = this.slots || [];

    return slots.reduce((sum, slot) => {
      return sum + (slot.commitments?.length ?? 0);
    }, 0);
  }

  get previousMonth() {
    return moment(this.month).add(-1, 'M').format(format);
  }

  get nextMonth() {
    return moment(this.month).add(1, 'M').format(format);
  }

  get monthString() {
    return moment(this.month).format(format);
  }

  get monthMoment() {
    return moment(this.month);
  }

  get title() {
    return `${moment(this.month).format('MMMM YYYY')} calendar`;
  }

  get remainingPeople() {
    const selectedIds = new Set((this.people || []).map((person) => person.id));

    return (this.activePeople || []).filter(
      (person) => !selectedIds.has(person.id),
    );
  }

  get uncommittedPeople() {
    const commitments = this.viewingSlot?.commitments || [];
    const committedIds = new Set(
      Array.from(commitments)
        .map((commitment) => commitment.person?.id)
        .filter(Boolean),
    );
    const activePeople = this.activePeople || [];

    return Array.from(activePeople).filter(
      (person) => !committedIds.has(person.id),
    );
  }

  @action
  addPerson(person) {
    const people = this.people || [];

    if (!people.some((entry) => entry.id === person.id)) {
      this.people = [...people, person];
    }
  }

  @action
  addAllActive() {
    this.people = [...(this.people || []), ...this.remainingPeople];
  }

  @action
  removePerson(person) {
    const personId = person?.id;
    this.people = (this.people || []).filter((entry) => entry.id !== personId);
  }

  @action
  async createCommitment(person) {
    const slot = this.viewingSlot;
    const commitment = this.store.createRecord('commitment', {
      slot: this.viewingSlot,
      person: person,
    });

    try {
      await commitment.save();
      this.errorMessage = undefined;
      this.toasts.show(
        `Committed ${person.name} to drive on ${moment(slot.start).format(
          'MMMM D',
        )}`,
      );
    } catch (error) {
      const errorDetail = error?.errors?.[0]?.detail;
      this.errorMessage = errorDetail || 'Couldn’t save your change';
    }
  }

  @action
  async deleteCommitment(commitment) {
    const name = commitment?.person?.name;
    const date = moment(commitment?.slot?.start).format('MMMM D');

    try {
      await commitment.destroyRecord();

      this.errorMessage = undefined;
      this.toasts.show(`Deleted ${name}’s commitment on ${date}`);
    } catch (error) {
      const errorDetail = error?.errors?.[0]?.detail;
      this.errorMessage = errorDetail || 'Couldn’t save your change';
    }
  }

  @action
  email() {
    const token = this.session?.data?.authenticated?.access_token;
    const people = [...(this.people || [])];

    people.forEach((person) => {
      const url = `${person.store
        .adapterFor('person')
        .buildURL('person', person.id)}/calendar-email/${this.monthString}`;
      fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then(() => {
        this.toasts.show(`Sent to ${person.name}`);
        this.people = (this.people || []).filter(
          (entry) => entry.id !== person.id,
        );
      });
    });
  }

  @action
  fetchLinks() {
    const token = this.session?.data?.authenticated?.access_token;

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
          }, {}),
        );
      })
      .then((links) => {
        const linkObjects = Object.keys(links).map((email) => {
          return { email, link: links[email] };
        });
        this.links = linkObjects;
        this.linksError = undefined;
      })
      .catch((e) => {
        this.links = undefined;
        this.linksError = e;
      });
  }
}

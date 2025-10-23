/* eslint-disable ember/no-classic-classes, ember/no-get */
import classic from 'ember-classic-decorator';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import BufferedProxy from 'ember-buffered-proxy/proxy';

@classic
export default class DriversController extends Controller {
  @service
  store;

  @service
  toasts;

  showInactive = false;
  sortProp = 'name';
  sortDir = 'asc';

  @computed('model.@each.{name,lastRide}', 'sortProp', 'sortDir')
  get sortedPeople() {
    const people = this.model ? this.model.toArray() : [];
    const sorted = people.slice().sort((a, b) => {
      let comparison;

      switch (this.sortProp) {
        case 'lastRide':
          comparison = this.compareByLastRide(a, b);
          break;
        case 'name':
        default:
          comparison = this.compareByName(a, b);
          break;
      }

      if (comparison !== 0) {
        return comparison;
      }

      return this.compareByName(a, b);
    });

    if (this.sortDir === 'desc') {
      sorted.reverse();
    }

    return sorted;
  }

  compareByName(a, b) {
    return (a.name || '')
      .toLowerCase()
      .localeCompare((b.name || '').toLowerCase());
  }

  compareByLastRide(a, b) {
    const aStart = a.lastRide?.start
      ? new Date(a.lastRide.start).getTime()
      : null;
    const bStart = b.lastRide?.start
      ? new Date(b.lastRide.start).getTime()
      : null;

    if (aStart === bStart) {
      return 0;
    }

    if (aStart === null) {
      return 1;
    }

    if (bStart === null) {
      return -1;
    }

    return aStart - bStart;
  }

  @action
  newPerson() {
    this.set(
      'editingPerson',
      BufferedProxy.create({
        content: this.store.createRecord('person'),
      }),
    );
  }

  @action
  editPerson(person) {
    const proxy = BufferedProxy.create({ content: person });

    this.set('editingPerson', proxy);
  }

  @action
  savePerson(event) {
    event?.preventDefault();

    const proxy = this.editingPerson;
    proxy.applyBufferedChanges();
    return proxy
      .get('content')
      .save()
      .then(() => this.set('editingPerson', undefined))
      .catch(() => {
        // FIXME this is handled for ride-saving failures, how to generalise?
      });
  }

  @action
  cancelPerson() {
    const model = this.get('editingPerson.content');

    if (model.get('isNew')) {
      model.destroyRecord();
    }

    this.set('editingPerson', undefined);
  }

  @action
  toggleShowInactive(event) {
    const checked = event?.target?.checked ?? false;
    this.set('showInactive', checked);
  }

  @action
  updatePersonActiveness(person, event) {
    const checked = event?.target?.checked ?? false;

    person.set('active', checked);
    person.save().catch(() => {
      this.toasts.show(
        `There was an error saving the active status of ${person.name}`,
      );
    });
  }

  @action
  updateEditingPerson(field, event) {
    const value = event?.target?.value ?? '';

    const editingPerson = this.editingPerson;
    if (editingPerson) {
      editingPerson.set(field, value);
    }
  }

  @action
  copyAddressSuccess() {
    this.toasts.show('Copied address');
  }

  @action
  sort(property) {
    if (this.sortProp === property) {
      this.set('sortDir', this.sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      this.set('sortProp', property);
      this.set('sortDir', 'asc');
    }
  }
}

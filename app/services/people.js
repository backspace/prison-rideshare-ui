import classic from 'ember-classic-decorator';
import { A } from '@ember/array';
import { computed } from '@ember/object';
import Service, { inject as service } from '@ember/service';

@classic
export default class PeopleService extends Service {
  @service
  store;

  people = A();
  loadPromise = null;

  init() {
    super.init(...arguments);
    this.set('people', this.store.peekAll('person'));
    this.load();
  }

  load() {
    if (this.loadPromise) {
      return this.loadPromise;
    }

    const promise = this.store
      .findAll('person', { reload: true })
      .then(() => {
        this.set('people', this.store.peekAll('person'));
        this.notifyPropertyChange('people');
      })
      .finally(() => {
        this.set('loadPromise', null);
      });

    this.set('loadPromise', promise);
    return promise;
  }

  @computed('people.{[],people.@each.name}')
  get all() {
    const people = this.people || A();
    return [...people].sort((a, b) => a.name.localeCompare(b.name));
  }

  @computed('all.{[],all.@each.active}')
  get active() {
    return this.all.filter((person) => person.active);
  }
}

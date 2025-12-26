import { A } from '@ember/array';
import Service, { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class PeopleService extends Service {
  @service
  store;

  @tracked people = A();
  @tracked loadPromise = null;

  constructor(owner, options) {
    super(owner, options);
    this.people = this.store.peekAll('person');
    this.load();
  }

  load() {
    if (this.loadPromise) {
      return this.loadPromise;
    }

    const promise = this.store
      .findAll('person', { reload: true })
      .then(() => {
        this.people = this.store.peekAll('person');
      })
      .finally(() => {
        this.loadPromise = null;
      });

    this.loadPromise = promise;
    return promise;
  }

  get all() {
    const people = this.people || A();
    return [...people].sort((a, b) => a.name.localeCompare(b.name));
  }

  get active() {
    return this.all.filter((person) => person.active);
  }
}

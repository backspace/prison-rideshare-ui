import classic from 'ember-classic-decorator';
import { computed } from '@ember/object';
import { filterBy } from '@ember/object/computed';
import Service, { inject as service } from '@ember/service';
import DS from 'ember-data';

@classic
export default class PeopleService extends Service {
  @service
  store;

  @computed
  get findAll() {
    return this.store.findAll('person');
  }

  @computed('findAll.@each.name')
  get all() {
    return DS.PromiseArray.create({
      promise: this.findAll.then((people) => people.sortBy('name')),
    });
  }

  @filterBy('all', 'active')
  active;
}

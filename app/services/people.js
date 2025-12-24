import classic from 'ember-classic-decorator';
import ArrayProxy from '@ember/array/proxy';
import { computed } from '@ember/object';
import PromiseProxyMixin from '@ember/object/promise-proxy-mixin';
import { filterBy } from '@ember/object/computed';
import Service, { inject as service } from '@ember/service';

const PromiseArray = ArrayProxy.extend(PromiseProxyMixin);

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
    return PromiseArray.create({
      promise: this.findAll.then((people) => people.sortBy('name')),
    });
  }

  @filterBy('all', 'active')
  active;
}

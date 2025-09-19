import classic from 'ember-classic-decorator';
import { computed } from '@ember/object';
import Service, { inject as service } from '@ember/service';

@classic
export default class InstitutionsService extends Service {
  @service
  store;

  @computed
  get all() {
    return this.store
      .findAll('institution')
      .then((institutions) => institutions.sortBy('name'));
  }
}

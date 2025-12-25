import classic from 'ember-classic-decorator';
import { computed } from '@ember/object';
import Service, { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

@classic
export default class InstitutionsService extends Service {
  @service
  store;

  @tracked institutions;

  async load() {
    this.institutions = await this.store.findAll('institution');
  }

  @computed('institutions.{[],institutions.@each.name}')
  get all() {
    let institutions = this.institutions || this.store.peekAll('institution');
    return [...institutions].sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
  }
}

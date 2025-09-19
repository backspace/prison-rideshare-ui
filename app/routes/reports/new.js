import classic from 'ember-classic-decorator';
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

@classic
export default class NewRoute extends Route {
  @service
  store;

  model() {
    return this.store.findAll('ride', { reload: true });
  }

  titleToken = 'Ride report';
}

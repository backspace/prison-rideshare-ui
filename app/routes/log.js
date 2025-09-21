import classic from 'ember-classic-decorator';
import { inject as service } from '@ember/service';
/* eslint-disable ember/no-classic-classes */
import Route from '@ember/routing/route';

@classic
export default class LogRoute extends Route {
  @service
  store;

  model() {
    return this.store.findAll('post');
  }

  titleToken = 'Log';
}

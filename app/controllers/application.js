/* eslint-disable ember/no-get */
import classic from 'ember-classic-decorator';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Controller, { inject as controller } from '@ember/controller';
import { tracked } from '@glimmer/tracking';

@classic
export default class ApplicationController extends Controller {
  @service
  overlaps;

  @service
  sidebar;

  @service
  session;

  @service
  store;

  @service
  userSocket;

  @controller
  rides;

  @tracked headerElement;

  @computed('overlaps.count', 'rides.model.@each.requiresConfirmation')
  get ridesBadgeCount() {
    let rides = this.get('rides.model') || [];
    return (
      this.get('overlaps.count') + rides.filterBy('requiresConfirmation').length
    );
  }

  @action
  logout() {
    this.session.invalidate();
    this.store.unloadAll();
  }
}

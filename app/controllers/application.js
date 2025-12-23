import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Controller, { inject as controller } from '@ember/controller';
import { tracked } from '@glimmer/tracking';

export default class ApplicationController extends Controller {
  @service overlaps;
  @service sidebar;
  @service session;
  @service store;
  @service userSocket;

  @controller rides;

  @tracked headerElement;

  get ridesBadgeCount() {
    const overlapsCount = this.overlaps.count ?? 0;
    const rides = this.rides.model || [];

    const ridesNeedingConfirmation =
      typeof rides.filterBy === 'function'
        ? rides.filterBy('requiresConfirmation')
        : rides.filter((ride) => ride?.requiresConfirmation);

    return overlapsCount + ridesNeedingConfirmation.length;
  }

  @action
  logout() {
    this.session.invalidate();
    this.store.unloadAll();
  }
}

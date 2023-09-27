import { inject as service } from '@ember/service';
import Controller, { inject as controller } from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
  overlaps: service(),
  sidebar: service(),
  session: service(),
  store: service(),
  userSocket: service(),

  rides: controller(),

  ridesBadgeCount: computed(
    'overlaps.count',
    'rides.model.@each.requiresConfirmation',
    function() {
      let rides = this.get('rides.model') || [];
      return (
        this.get('overlaps.count') +
        rides.filterBy('requiresConfirmation').length
      );
    }
  ),

  actions: {
    logout() {
      this.session.invalidate();
      this.store.unloadAll();
    },
  },
});

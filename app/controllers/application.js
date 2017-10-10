import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';

export default Controller.extend({
  sidebar: service(),
  session: service(),
  userSocket: service(),

  userCount: computed('userSocket.present.length', function() {
    const count = this.get('userSocket.present.length');

    if (count > 1) {
      return count;
    } else {
      return undefined;
    }
  }),

  actions: {
    logout() {
      this.get('session').invalidate();
      this.store.unloadAll();
    }
  }
});

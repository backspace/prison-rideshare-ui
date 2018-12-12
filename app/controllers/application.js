import { inject as service } from '@ember/service';
import Controller from '@ember/controller';

export default Controller.extend({
  overlaps: service(),
  sidebar: service(),
  session: service(),
  store: service(),
  userSocket: service(),

  actions: {
    logout() {
      this.get('session').invalidate();
      this.store.unloadAll();
    },
  },
});

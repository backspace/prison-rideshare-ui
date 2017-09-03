import Ember from 'ember';
import BufferedProxy from 'ember-buffered-proxy/proxy';
import config from 'prison-rideshare-ui/config/environment';

export default Ember.Controller.extend({
  paperToaster: Ember.inject.service(),

  editingRide: undefined,
  rideProxy: BufferedProxy.create(),

  actions: {
    setRide(ride) {
      this.set('editingRide', ride);
      this.set('rideProxy.content', ride);
    },

    submit() {
      const proxy = this.get('rideProxy');

      proxy.applyBufferedChanges();
      return proxy.get('content').save().then(() => {
        this.get('paperToaster').show('Your report was saved', { duration: config.toastDuration });
        this.set('editingRide', undefined);
        this.set('rideProxy.content', undefined);
        this.transitionToRoute('application');
      });
    }
  }
});

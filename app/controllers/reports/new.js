import Ember from 'ember';
import BufferedProxy from 'ember-buffered-proxy/proxy';

export default Ember.Controller.extend({
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
        this.set('editingRide', undefined);
        this.transitionToRoute('application');
      });
    }
  }
});

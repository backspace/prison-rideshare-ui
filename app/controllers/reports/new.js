import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import BufferedProxy from 'ember-buffered-proxy/proxy';

export default Controller.extend({
  toasts: service(),

  editingRide: undefined,
  rideProxy: BufferedProxy.create(),

  actions: {
    setRide(ride) {
      this.set('editingRide', ride);
      this.set('rideProxy.content', ride);
    },

    submit() {
      if (this.get('editingRide')) {
        const proxy = this.get('rideProxy');

        proxy.applyBufferedChanges();
        return proxy.get('content').save().then(() => {
          this.get('toasts').show('Your report was saved');
          this.set('editingRide', undefined);
          this.set('rideProxy.content', undefined);
          this.transitionToRoute('application');
          window.scrollTo(0,0);
        }, () => {
          this.get('toasts').show('There was an error saving your report!');
        });
      } else {
        this.get('toasts').show('Please choose a ride');
      }
    }
  }
});

import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import BufferedProxy from 'ember-buffered-proxy/proxy';
import config from 'prison-rideshare-ui/config/environment';

export default Controller.extend({
  paperToaster: service(),

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
          this.get('paperToaster').show('Your report was saved', {
            duration: config.toastDuration,
            position: 'top right'
          });
          this.set('editingRide', undefined);
          this.set('rideProxy.content', undefined);
          this.transitionToRoute('application');
          window.scrollTo(0,0);
        }, () => {
          this.get('paperToaster').show('There was an error saving your report!', {
            duration: config.toastDuration,
            position: 'top right'
          });
        });
      } else {
        this.get('paperToaster').show('Please choose a ride', {
          duration: config.toastDuration,
          position: 'top right'
        });
      }
    }
  }
});

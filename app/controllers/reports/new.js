import { inject as service } from '@ember/service';
import Controller from '@ember/controller';

export default Controller.extend({
  session: service(),
  store: service(),
  toasts: service(),

  editingRide: undefined,

  actions: {
    setRide(ride) {
      if (this.editingRide) {
        this.editingRide.rollbackAttributes();
      }

      this.set('editingRide', ride);
    },

    submit() {
      let editingRide = this.editingRide;

      if (editingRide) {
        return editingRide.save().then(
          () => {
            this.toasts.show('Your report was saved');

            // Remove the ride from the store before reloading from the server
            this.store.unloadRecord(this.editingRide);

            this.set('editingRide', undefined);
            this.transitionToRoute('application');
            window.scrollTo(0, 0);
          },
          () => {
            this.toasts.show('There was an error saving your report!');
          }
        );
      } else {
        this.toasts.show('Please choose a ride');
      }
    },
  },
});

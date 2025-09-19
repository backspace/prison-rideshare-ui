import classic from 'ember-classic-decorator';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';

@classic
export default class NewController extends Controller {
  @service
  session;

  @service
  store;

  @service
  toasts;

  editingRide;

  @action
  setRide(ride) {
    if (this.editingRide) {
      this.editingRide.rollbackAttributes();
    }

    this.set('editingRide', ride);
  }

  @action
  submitReport() {
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
  }
}

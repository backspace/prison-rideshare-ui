import classic from 'ember-classic-decorator';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';

@classic
export default class NewController extends Controller {
  @service router;

  @service
  session;

  @service
  store;

  @service
  toasts;

  editingRide;
  errorMessage = undefined;

  _setNumberProperty(property, event) {
    const ride = this.editingRide;

    if (!ride) {
      return;
    }

    const rawValue = event?.target?.value ?? '';
    const parsedValue = rawValue === '' ? null : Number(rawValue);

    ride.set(property, Number.isNaN(parsedValue) ? null : parsedValue);
  }

  @action
  setRide(ride) {
    if (this.editingRide) {
      this.editingRide.rollbackAttributes();
    }

    this.set('editingRide', ride);
  }

  @action
  updateDistance(event) {
    this._setNumberProperty('distance', event);
  }

  @action
  updateDonation(event) {
    const ride = this.editingRide;

    if (!ride) {
      return;
    }

    const checked = event?.target?.checked ?? false;

    ride.set('donation', checked);
  }

  @action
  updateFoodExpenses(event) {
    this._setNumberProperty('foodExpensesDollars', event);
  }

  @action
  updateCarExpenses(event) {
    this._setNumberProperty('carExpensesDollars', event);
  }

  @action
  updateReportNotes(event) {
    const ride = this.editingRide;

    if (!ride) {
      return;
    }

    const value = event?.target?.value ?? '';

    ride.set('reportNotes', value);
  }

  @action
  submitReport(event) {
    event?.preventDefault?.();

    let editingRide = this.editingRide;

    if (editingRide) {
      return editingRide.save().then(
        () => {
          this.set('errorMessage', undefined);
          this.toasts.show('Your report was saved');

          // Remove the ride from the store before reloading from the server
          this.store.unloadRecord(this.editingRide);

          this.set('editingRide', undefined);
          this.router.transitionTo('application');
          window.scrollTo(0, 0);
        },
        () => {
          this.set(
            'errorMessage',
            'There was an error saving your report!',
          );
        },
      );
    } else {
      this.set('errorMessage', 'Please choose a ride');
    }
  }
}

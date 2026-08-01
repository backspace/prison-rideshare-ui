/* eslint-disable ember/classic-decorator-no-classic-methods, ember/no-computed-properties-in-native-classes */
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';

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

  @computed('model', 'model.{[],@each.complete}')
  get reportableRides() {
    const rides = Array.from(this.model || []);
    let reportableRides = rides.filter((ride) => !ride.complete);
    reportableRides.sort((a, b) => a.start - b.start);
    return reportableRides;
  }

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
  async submitReport(event) {
    event?.preventDefault?.();

    let editingRide = this.editingRide;

    if (editingRide) {
      try {
        await editingRide.save();
        editingRide.set('complete', true);

        this.set('errorMessage', undefined);
        this.toasts.show('Your report was saved');

        await this.store.findAll('ride', { reload: true });

        this.set('editingRide', undefined);
        this.router.transitionTo('application');
        window.scrollTo(0, 0);
      } catch (error) {
        const details = (error?.errors ?? [])
          .filter((e) => e.source?.pointer?.startsWith('/data/attributes'))
          .map((e) => e.detail || e.title)
          .filter(Boolean);

        this.set(
          'errorMessage',
          details.length
            ? `There was an error saving your report: ${details.join(', ')}`
            : 'There was an error saving your report!',
        );
      }
    } else {
      this.set('errorMessage', 'Please choose a ride');
    }
  }
}

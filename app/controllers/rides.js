import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import BufferedProxy from 'ember-buffered-proxy/proxy';
import { tracked } from '@glimmer/tracking';

export default class RidesController extends Controller {
  queryParams = [
    {
      showCompleted: { as: 'completed' },
      showCancelled: { as: 'cancelled' },
      sortProp: { as: 'sort' },
      sortDir: { as: 'dir' },
      search: { replace: true },
    },
  ];

  @service('overlaps')
  overlapsService;

  @service
  store;

  @service
  toasts;

  @service('people')
  peopleService;

  @tracked editingRide;
  @tracked editingCancellation;
  @tracked search = undefined;
  @tracked showCompleted = false;
  @tracked showCancelled = false;
  @tracked sortProp = 'start';
  @tracked sortDir = 'asc';
  @tracked showCreation = false;
  @tracked rideErrorMessage = undefined;
  @tracked cancellationErrorMessage = undefined;
  @tracked rideToCombine;

  get people() {
    return this.peopleService.all;
  }

  get filteredRides() {
    const showCompleted = this.showCompleted,
      showCancelled = this.showCancelled;
    const search = this.search;

    let rides = this.model.rejectBy('isCombined').rejectBy('isNew');

    if (!showCompleted) {
      rides = rides.filterBy('complete', false);
    }

    if (!showCancelled) {
      rides = rides.filterBy('enabled');
    }

    if (search) {
      rides = rides.filter((ride) => ride.matches(search));
    }

    rides.setEach('isDivider', false);

    let sorted = rides.sortBy('start');
    const sortDir = this.sortDir;
    const now = new Date();

    if (sortDir === 'desc') {
      sorted = sorted.slice().reverse();
    }

    if (sortDir === 'asc') {
      const firstAfterNow = sorted.find((ride) => ride.start > now);

      if (firstAfterNow) {
        firstAfterNow.set('isDivider', true);
      }
    } else {
      const firstBeforeNow = sorted.find((ride) => ride.start < now);

      if (firstBeforeNow) {
        firstBeforeNow.set('isDivider', true);
      }
    }

    return sorted;
  }

  @action
  newRide() {
    this.editingRide = BufferedProxy.create({
      content: this.store.createRecord('ride'),
    });
  }

  @action
  editRide(model) {
    this.editingRide = BufferedProxy.create({
      content: model,
    });
  }

  @action
  async submitRide(proxy) {
    let buffer = proxy.buffer;
    proxy.applyBufferedChanges();

    try {
      await proxy.content.save();

      this.editingRide = undefined;
      this.rideErrorMessage = undefined;

      await this.overlapsService.fetch();
    } catch {
      this.rideErrorMessage = 'There was an error saving this ride';
      proxy.setProperties(buffer);
    }
  }

  @action
  cancel() {
    const model = this.editingRide?.content;

    if (!model) {
      return;
    }

    if (model.isNew) {
      model.destroyRecord();
    } else {
      model.rollbackAttributes();
    }

    const editingRide = this.editingRide;
    editingRide?.discardBufferedChanges();
    this.editingRide = undefined;
  }

  @action
  editCancellation(ride) {
    this.editingCancellation = BufferedProxy.create({
      content: ride,
    });

    if (ride.enabled) {
      this.editingCancellation.set('cancelled', true);
    }
  }

  @action
  submitCancellation(proxy) {
    let buffer = proxy.buffer;
    proxy.applyBufferedChanges();

    return proxy.content
      .save()
      .then(() => {
        this.editingCancellation = undefined;
        this.cancellationErrorMessage = undefined;
      })
      .catch(() => {
        this.cancellationErrorMessage =
          'There was an error cancelling this ride';
        proxy.content.rollbackAttributes();
        proxy.setProperties(buffer);
      });
  }

  @action
  cancelCancellation() {
    const editingCancellation = this.editingCancellation;
    editingCancellation?.discardBufferedChanges();
    this.editingCancellation = undefined;
  }

  @action
  combineRide(ride) {
    if (this.rideToCombine) {
      const rideToCombine = this.rideToCombine;

      if (rideToCombine.id == ride.id) {
        this.rideToCombine = undefined;
      } else {
        rideToCombine.set('combinedWith', ride);

        rideToCombine.save().then(() => {
          this.rideToCombine = undefined;
        });
      }
    } else {
      this.rideToCombine = ride;
    }
  }

  @action
  uncombineRide(ride) {
    ride.set('combinedWith', null);
    ride.save();
  }

  @action
  updateSearch(value) {
    this.search = value;
  }

  @action
  clearSearch() {
    this.search = undefined;
  }

  @action
  updateSearchInput(event) {
    const value = event?.target?.value ?? '';
    this.updateSearch(value);
  }

  @action
  sort(property) {
    if (this.sortProp === property) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortProp = property;
      this.sortDir = 'asc';
    }
  }

  @action toggle(propertyName) {
    this[propertyName] = !this[propertyName];
  }
}

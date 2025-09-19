import classic from 'ember-classic-decorator';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';
import Controller from '@ember/controller';
import BufferedProxy from 'ember-buffered-proxy/proxy';

@classic
export default class RidesController extends Controller {
  queryParams = {
    showCompleted: 'completed',
    showCancelled: 'cancelled',

    sortProp: 'sort',
    sortDir: 'dir',

    search: {
      replace: true,
    },
  };

  @service('overlaps')
  overlapsService;

  @service
  store;

  @service
  toasts;

  @service('people')
  peopleService;

  @alias('peopleService.all')
  people;

  editingRide;
  editingCancellation;
  showCompleted = false;
  showCancelled = false;
  sortProp = 'start';
  sortDir = 'asc';
  showCreation = false;

  @computed(
    'showCompleted',
    'showCancelled',
    'model.@each.{complete,enabled,isCombined}',
    'search',
    'sortDir'
  )
  get filteredRides() {
    const showCompleted = this.showCompleted,
      showCancelled = this.showCancelled;
    const search = this.search;

    let rides = this.model.rejectBy('isCombined');

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

    const sorted = rides.sortBy('start');
    const sortDir = this.sortDir;
    const now = new Date();

    if (sortDir === 'asc') {
      const firstAfterNow = sorted.find((ride) => ride.get('start') > now);

      if (firstAfterNow) {
        firstAfterNow.set('isDivider', true);
      }
    } else {
      const reversed = sorted.reverse();
      const firstBeforeNow = reversed.find((ride) => ride.get('start') < now);

      if (firstBeforeNow) {
        firstBeforeNow.set('isDivider', true);
      }
    }

    return rides;
  }

  @action
  newRide() {
    this.set(
      'editingRide',
      BufferedProxy.create({
        content: this.store.createRecord('ride'),
      })
    );
  }

  @action
  editRide(model) {
    this.set(
      'editingRide',
      BufferedProxy.create({
        content: model,
      })
    );
  }

  @action
  submitRide(proxy) {
    let buffer = proxy.buffer;
    proxy.applyBufferedChanges();

    return proxy
      .get('content')
      .save()
      .then(() => this.set('editingRide', undefined))
      .catch(() => {
        this.toasts.show('There was an error saving this ride');
        proxy.setProperties(buffer);
      })
      .then(() => this.overlapsService.fetch());
  }

  @action
  cancel() {
    const model = this.get('editingRide.content');

    if (model.get('isNew')) {
      model.destroyRecord();
    } else {
      model.rollbackAttributes();
    }

    this.editingRide.discardBufferedChanges();
    this.set('editingRide', undefined);
  }

  @action
  editCancellation(ride) {
    this.set(
      'editingCancellation',
      BufferedProxy.create({
        content: ride,
      })
    );

    if (ride.get('enabled')) {
      this.set('editingCancellation.cancelled', true);
    }
  }

  @action
  submitCancellation(proxy) {
    let buffer = proxy.buffer;
    proxy.applyBufferedChanges();

    return proxy
      .get('content')
      .save()
      .then(() => this.set('editingCancellation'), undefined)
      .catch(() => {
        this.toasts.show('There was an error cancelling this ride');
        proxy.content.rollbackAttributes();
        proxy.setProperties(buffer);
      });
  }

  @action
  cancelCancellation() {
    this.editingCancellation.discardBufferedChanges();
    this.set('editingCancellation', undefined);
  }

  @action
  combineRide(ride) {
    if (this.rideToCombine) {
      const rideToCombine = this.rideToCombine;

      if (rideToCombine.id == ride.id) {
        this.set('rideToCombine', undefined);
      } else {
        rideToCombine.set('combinedWith', ride);

        rideToCombine.save().then(() => this.set('rideToCombine', undefined));
      }
    } else {
      this.set('rideToCombine', ride);
    }
  }

  @action
  uncombineRide(ride) {
    ride.set('combinedWith', null);
    ride.save();
  }

  @action
  clearSearch() {
    this.set('search', undefined);
  }
}

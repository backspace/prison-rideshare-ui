import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import BufferedProxy from 'ember-buffered-proxy/proxy';

export default Controller.extend({
  queryParams: {
    showCompleted: 'completed',
    showCancelled: 'cancelled',

    sortProp: 'sort',
    sortDir: 'dir',
  },

  peopleService: service('people'),
  people: alias('peopleService.all'),

  editingRide: undefined,
  editingCancellation: undefined,

  showCompleted: false,
  showCancelled: false,

  sortProp: 'start',
  sortDir: 'asc',

  filteredRides: computed('showCompleted', 'showCancelled', 'model.@each.complete', 'model.@each.enabled', 'model.@each.isCombined', function() {
    const showCompleted = this.get('showCompleted'), showCancelled = this.get('showCancelled');

    let rides = this.get('model').rejectBy('isCombined');

    if (!showCompleted) {
      rides = rides.filterBy('complete', false);
    }

    if (!showCancelled) {
      rides = rides.filterBy('enabled');
    }

    return rides;
  }),

  actions: {
    newRide() {
      this.set('editingRide', BufferedProxy.create({
        content: this.store.createRecord('ride')
      }));
    },

    editRide(model) {
      this.set('editingRide', BufferedProxy.create({
        content: model
      }));
    },

    submit(proxy) {
      proxy.applyBufferedChanges();
      return proxy.get('content').save().then(() => this.set('editingRide', undefined)).catch(() => {
        // FIXME what is to be done?
      });
    },

    cancel() {
      const model = this.get('editingRide.content');

      if (model.get('isNew')) {
        model.destroyRecord();
      }

      this.get('editingRide').discardBufferedChanges();
      this.set('editingRide', undefined);
    },

    editCancellation(ride) {
      this.set('editingCancellation', BufferedProxy.create({
        content: ride
      }));

      if (ride.get('enabled')) {
        this.set('editingCancellation.cancelled', true);
      }
    },

    submitCancellation(proxy) {
      proxy.applyBufferedChanges();
      return proxy.get('content').save().then(() => this.set('editingCancellation'), undefined);
    },

    cancelCancellation() {
      this.get('editingCancellation').discardBufferedChanges();
      this.set('editingCancellation', undefined);
    },

    combineRide(ride) {
      if (this.get('rideToCombine')) {
        const rideToCombine = this.get('rideToCombine');

        if (rideToCombine.id == ride.id) {
          this.set('rideToCombine', undefined);
        } else {
          rideToCombine.set('combinedWith', ride);

          rideToCombine.save().then(() => this.set('rideToCombine', undefined));
        }
      } else {
        this.set('rideToCombine', ride);
      }
    },

    uncombineRide(ride) {
      ride.set('combinedWith', null);
      ride.save();
    }
  }
});

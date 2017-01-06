import Ember from 'ember';
import BufferedProxy from 'ember-buffered-proxy/proxy';

export default Ember.Controller.extend({
  institutionsService: Ember.inject.service('institutions'),
  institutions: Ember.computed.alias('institutionsService.all'),

  peopleService: Ember.inject.service('people'),
  people: Ember.computed.alias('peopleService.all'),

  editingRide: undefined,
  editingCancellation: undefined,

  showCompleted: false,
  showCancelled: false,

  filteredRides: Ember.computed('showCompleted', 'showCancelled', 'model.@each.complete', 'model.@each.enabled', function() {
    const showCompleted = this.get('showCompleted'), showCancelled = this.get('showCancelled');

    let rides = this.get('model');

    if (!showCompleted) {
      rides = rides.filterBy('complete', false);
    }

    if (!showCancelled) {
      rides = rides.filterBy('enabled');
    }

    return rides;
  }),

  cancellationReasons: [
    'lockdown',
    'visitor',
    'no car',
    'no driver'
  ],

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
      return proxy.get('content').save().then(() => this.set('editingRide', undefined));
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

    cancelledChanged(cancelled) {
      if (!cancelled) {
        this.set('editingCancellation.cancellationReason', null);
      }

      this.set('editingCancellation.cancelled', cancelled);
    },

    submitCancellation(proxy) {
      proxy.applyBufferedChanges();
      return proxy.get('content').save().then(() => this.set('editingCancellation'), undefined);
    },

    cancelCancellation() {
      this.get('editingCancellation').discardBufferedChanges();
      this.set('editingCancellation', undefined);
    }
  }
});

import Ember from 'ember';
import BufferedProxy from 'ember-buffered-proxy/proxy';

export default Ember.Controller.extend({
  institutionsService: Ember.inject.service('institutions'),
  institutions: Ember.computed.alias('institutionsService.all'),

  peopleService: Ember.inject.service('people'),
  people: Ember.computed.alias('peopleService.all'),

  editingRide: undefined,

  showCompleted: false,

  notCompleteRides: Ember.computed.filterBy('model', 'notComplete'),

  filteredRides: Ember.computed('showCompleted', 'model.@each.complete', function() {
    if (this.get('showCompleted')) {
      return this.get('model');
    } else {
      return this.get('notCompleteRides');
    }
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
      return proxy.get('content').save().then(() => this.set('editingRide', undefined));
    },

    cancel() {
      const model = this.get('editingRide.content');

      if (model.get('isNew')) {
        model.destroyRecord();
      }

      this.get('editingRide').discardBufferedChanges();
      this.set('editingRide', undefined);
    }
  }
});

import Ember from 'ember';

export default Ember.Controller.extend({
  institutionsService: Ember.inject.service('institutions'),
  institutions: Ember.computed.alias('institutionsService.all'),

  peopleService: Ember.inject.service('people'),
  people: Ember.computed.alias('peopleService.all'),

  editingRide: undefined,

  actions: {
    editingRide() {
      this.set('editingRide', this.store.createRecord('ride'));
    },

    editRide(model) {
      this.set('editingRide', model);
    },

    submit(model) {
      return model.save().then(() => this.set('editingRide', undefined));
    },

    cancel(model) {
      model.rollbackAttributes();
      this.set('editingRide', undefined);
    }
  }
});

import Ember from 'ember';

export default Ember.Controller.extend({
  institutionsService: Ember.inject.service('institutions'),
  institutions: Ember.computed.alias('institutionsService.all'),

  peopleService: Ember.inject.service('people'),
  people: Ember.computed.alias('peopleService.all'),

  newRide: undefined,

  actions: {
    newRide() {
      this.set('newRide', this.store.createRecord('ride'));
    },

    editRide(model) {
      this.set('newRide', model);
    },

    submit(model) {
      return model.save().then(() => this.set('newRide', undefined));
    },

    cancel(model) {
      model.destroyRecord();
      this.set('newRide', undefined);
    }
  }
});

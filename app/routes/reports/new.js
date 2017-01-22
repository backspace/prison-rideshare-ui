import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.store.findAll('ride').then(rides => rides.filterBy('enabled').filterBy('notComplete').rejectBy('isCombined'));
  }
});

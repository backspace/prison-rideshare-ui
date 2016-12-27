import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.store.createRecord('ride');
  },

  actions: {
    submit(model) {
      return model.save().then(() => this.transitionTo('rides'));
    }
  }
});

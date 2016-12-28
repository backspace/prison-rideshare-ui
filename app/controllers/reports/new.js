import Ember from 'ember';

export default Ember.Controller.extend({
  editingRide: undefined,

  actions: {
    submit(model) {
      return model.save().then(() => {
        this.set('editingRide', undefined);
        this.transitionToRoute('application');
      });
    }
  }
});

import Ember from 'ember';

export default Ember.Component.extend({
  tagName: '',

  actions: {
    setDriver(driver) {
      const ride = this.get('ride');

      ride.set('driver', driver);

      return ride.get('carOwner').then(carOwner => {
        if (!carOwner) {
          ride.set('carOwner', driver);
        }

        return ride.save();
      });
    },

    setCarOwner(carOwner) {
      const ride = this.get('ride');

      ride.set('carOwner', carOwner);
      return ride.save();
    }
  }
});

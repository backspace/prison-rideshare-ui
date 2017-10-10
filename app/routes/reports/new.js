import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    const now = new Date();

    return this.store.findAll('ride').then(rides => rides.filterBy('enabled').filterBy('notComplete').rejectBy('isCombined').reject(ride => {
      return ride.get('start') > now;
    }));
  },

  titleToken: 'Ride report'
});

import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    return this.store.findAll('slot').catch(() => [
      this.store.createRecord('slot', {start: new Date(2017, 11, 3, 17), end: new Date(2017, 11, 3, 21), count: 2}),
      this.store.createRecord('slot', {start: new Date(2017, 11, 3, 11), end: new Date(2017, 11, 3, 17), count: 3}),
      this.store.createRecord('slot', {start: new Date(2017, 11, 8, 17), count: 4})
    ]);
  }
});

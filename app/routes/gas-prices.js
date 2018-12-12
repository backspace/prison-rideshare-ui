import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    return this.store.findAll('gas-price');
  },

  titleToken: 'Gas prices',
});

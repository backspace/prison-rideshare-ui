import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default Route.extend({
  model({ month }) {
    return RSVP.hash({
      slots: this.store.findAll('slot'),
      month
    });
  }
});

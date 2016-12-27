import Ember from 'ember';
import DS from 'ember-data';

import moment from 'moment';

export default DS.Model.extend({
  name: DS.attr(),

  start: DS.attr(),
  end: DS.attr(),

  startTime: Ember.computed('date', 'start', timeGetAndSet('start')),
  endTime: Ember.computed('date', 'end', timeGetAndSet('end'))
});

function timeGetAndSet(property) {
  return {
    get() {
      const time = this.get(property);
      return moment(time).format('h:mma');
    },
    set(key, value) {
      const date = this.get('date');
      const dateString = moment(date).format('YYYY-MM-DD');

      // FIXME inefficient, no?
      this.set(property, moment(`${dateString} ${value}`).toDate());
      return value;
    }
  };
}

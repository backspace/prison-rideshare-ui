import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  daySlots: computed('day.id', 'slots.@each.start', function() {
    const dayDateString = this.get('day.date').toDateString();
    const slots = this.get('slots');

    return slots.filter(slot => dayDateString === slot.get('start').toDateString()).sortBy('start');
  }),

  slot: computed('day.id', 'slots.@each.start', function() {
    const dayDateString = this.get('day.date').toDateString();
    const slots = this.get('slots');

    return slots.find(slot => dayDateString === slot.get('start').toDateString());
  })
});

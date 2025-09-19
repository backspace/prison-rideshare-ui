import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  daySlots: computed('day.{date,id}', 'slots.@each.start', function () {
    const dayDateString = this.get('day.date').toDateString();
    const slots = this.slots;

    return slots
      .filter((slot) => dayDateString === slot.get('start').toDateString())
      .sortBy('start');
  }),
});

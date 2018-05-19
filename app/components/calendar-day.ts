import Component from '@ember/component';
import { computed } from '@ember/object';

import Slot from 'prison-rideshare-ui/models/slot';

export default class CalendarDay extends Component {
  slots!: Slot[];
  day!: Day;

  daySlots = computed('day.id', 'slots.@each.start', function(this: CalendarDay): Slot[] {
    const dayDateString = this.day.date.toDateString();
    const slots = this.get('slots');

    return slots.filter(slot => dayDateString === slot.get('start').toDateString()).sortBy('start');
  });
};

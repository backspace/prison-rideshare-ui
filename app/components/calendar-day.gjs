/* eslint-disable ember/classic-decorator-no-classic-methods, ember/no-classic-classes, ember/no-classic-components, ember/no-computed-properties-in-native-classes, ember/no-get, ember/require-tagless-components */
import { computed } from '@ember/object';
import Component from '@ember/component';
import CalendarSlot from 'prison-rideshare-ui/components/calendar-slot';

export default class CalendarDay extends Component {
  <template>
    <div class='day'>
      {{this.day.number}}
    </div>

    {{#each this.daySlots as |slot|}}
      <CalendarSlot
        @slot={{slot}}
        @person={{this.person}}
        @count={{this.count}}
        @setViewingSlot={{this.setViewingSlot}}
        @setError={{this.setError}}
      />
    {{/each}}
  </template>

  @computed('day.{date,id}', 'slots.@each.start')
  get daySlots() {
    const dayDateString = this.get('day.date').toDateString();
    const slots = this.slots;

    return slots
      .filter((slot) => dayDateString === slot.get('start').toDateString())
      .sort((a, b) => a.get('start') - b.get('start'));
  }
}

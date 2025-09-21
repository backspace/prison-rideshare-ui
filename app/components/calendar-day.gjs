/* eslint-disable ember/no-classic-classes, ember/no-classic-components, ember/no-get, ember/require-tagless-components */
import classic from 'ember-classic-decorator';
import { computed } from '@ember/object';
import Component from '@ember/component';
import CalendarSlot from "prison-rideshare-ui/components/calendar-slot";

@classic
export default class CalendarDay extends Component {<template><div class="day">
  {{this.day.number}}
</div>

{{#each this.daySlots as |slot|}}
  <CalendarSlot @slot={{slot}} @person={{this.person}} @count={{this.count}} @setViewingSlot={{this.setViewingSlot}} />
{{/each}}</template>
  @computed('day.{date,id}', 'slots.@each.start')
  get daySlots() {
    const dayDateString = this.get('day.date').toDateString();
    const slots = this.slots;

    return slots
      .filter((slot) => dayDateString === slot.get('start').toDateString())
      .sortBy('start');
  }
}

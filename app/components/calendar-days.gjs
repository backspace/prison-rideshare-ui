import Days from 'ember-power-calendar/components/power-calendar/days';

export default class extends Days {
  <template>
    {{! FIXME it’s too bad I have to copy the entire template just to change the days to divs instead of buttons! }}
    <div class='ember-power-calendar-row ember-power-calendar-weekdays'>
      {{#each this.weekdaysNames as |wdn|}}
        <div class='ember-power-calendar-weekday'>
          {{wdn}}
        </div>
      {{/each}}
    </div>

    <div class='ember-power-calendar-day-grid'>
      {{#each this.weeks key='id' as |week|}}
        <div
          class='ember-power-calendar-row ember-power-calendar-week'
          data-missing-days={{week.missingDays}}
        >
          {{#each week.days key='id' as |day|}}
            <div
              data-date={{day.id}}
              class='ember-power-calendar-day {{
                if this.onSelect 'ember-power-calendar-day--interactive'
              }} {{
                if
                day.isCurrentMonth
                'ember-power-calendar-day--current-month'
                'ember-power-calendar-day--other-month'
              }} {{if day.isSelected 'ember-power-calendar-day--selected'}} {{
                if day.isToday 'ember-power-calendar-day--today'
              }} {{if day.isFocused 'ember-power-calendar-day--focused'}} {{
                if day.isRangeStart 'ember-power-calendar-day--range-start'
              }} {{if day.isRangeEnd 'ember-power-calendar-day--range-end'}}'
              disabled={{day.isDisabled}}
            >
              {{#if (has-block)}}
                {{yield day this.publicAPI}}
              {{else}}
                {{day.number}}
              {{/if}}
            </div>
          {{/each}}
        </div>
      {{/each}}
    </div>
  </template>
}

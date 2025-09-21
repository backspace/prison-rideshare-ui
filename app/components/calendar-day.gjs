<div class='day'>
  {{this.day.number}}
</div>

{{#each this.daySlots as |slot|}}
  <CalendarSlot
    @slot={{slot}}
    @person={{this.person}}
    @count={{this.count}}
    @setViewingSlot={{this.setViewingSlot}}
  />
{{/each}}
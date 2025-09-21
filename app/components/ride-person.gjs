{{! template-lint-disable no-action }}
{{#if this.person}}
  <span class='ride-person'>
    <PersonBadge
      @person={{this.person}}
      @property={{this.property}}
      @clear={{action 'clear'}}
    />
  </span>
{{else}}
  <PaperSelect
    @selected={{this.person}}
    @options={{this.people}}
    @onChange={{this.onChange}}
    @allowClear={{true}}
    @searchField='name' as |person|
  >
    {{person.name}}
  </PaperSelect>
{{/if}}
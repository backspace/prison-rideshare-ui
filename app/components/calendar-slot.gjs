{{! template-lint-disable no-action }}
<div class='slot {{if this.hidden 'hidden'}}'>
  {{#if this.count}}
    <span class='hours'>
      {{this.timespan}}
    </span>
    <button
      class='count {{if (gt this.slot.commitments.length 0) 'committed-to'}}'
      onClick={{action this.setViewingSlot this.slot}}
      type='button'
    >
      {{this.capacity}}
    </button>
  {{else}}
    <PaperCheckbox
      @value={{this.isCommittedTo}}
      @disabled={{this.disabled}}
      @indeterminate={{this.toggle.isRunning}}
      @onChange={{perform this.toggle}}
    >
      <span class='hours'>
        {{this.timespan}}
      </span>
    </PaperCheckbox>
  {{/if}}
</div>
{{! template-lint-disable no-action }}
<@body.row class={{this.classAttribute}} as |row|>
  {{#if this.showCreation}}
    <row.cell class='creation'>
      {{this.creation}}
    </row.cell>
  {{/if}}
  <row.cell class='date-cell' @onClick={{action 'toggleCreation'}}>
    {{#if this.ride.isDivider}}
      <ScrollTo />
    {{/if}}
    <span class='date'>
      {{this.ride.rideTimes}}
    </span>
    {{#if this.showCreation}}
      {{paper-icon 'alarm off' size=14}}
    {{else}}
      {{paper-icon 'add alarm' size=14}}
    {{/if}}
  </row.cell>
  <row.cell class='institution'>
    {{this.ride.institution.name}}
  </row.cell>
  <row.cell class='name-and-contact'>
    <span class='name'>
      {{this.ride.namePlusPassengers}}
    </span>
    {{#if this.ride.firstTime}}
      {{paper-icon 'announcement' size=10 title='first time rider'}}
    {{/if}}
    <div class='medium-and-contact'>
      {{#if this.mediumIcon}}
        {{paper-icon this.mediumIcon size=10 title=this.mediumIconTitle}}
      {{/if}}
      <span class='contact'>
        <LinkedContact @contact={{this.ride.contact}} />
      </span>
    </div>
  </row.cell>
  <row.cell class='address'>
    {{this.ride.address}}
  </row.cell>
  <row.cell class='driver-and-car-owner'>
    {{#if this.combined}}
      {{#unless this.rideToCombine}}
        <PaperButton
          class='combine'
          @iconButton={{true}}
          @aria-label='Uncombine this ride'
          @title='Uncombine this ride'
          @onClick={{action this.uncombineRide this.ride}}
        >
          {{paper-icon 'call split'}}
        </PaperButton>
      {{/unless}}
    {{else}}
      <span class='driver'>
        <RidePerson
          @ride={{this.ride}}
          @property='driver'
          @onChange={{action 'setDriver'}}
        />
      </span>
      <span class='car-owner'>
        <RidePerson
          @ride={{this.ride}}
          @property='carOwner'
          @onChange={{action 'setCarOwner'}}
        />
      </span>
      {{#if this.ride.overridable}}
        {{paper-icon
          'directions_bus'
          title='driver can override car expenses (van-driving, probably)'
        }}
      {{/if}}
      {{#if (or (not this.ride.children) this.rideToCombine)}}
        <PaperButton
          class='combine'
          @iconButton={{true}}
          @raised={{eq this.ride.id this.rideToCombine.id}}
          @aria-label={{this.combineButtonLabel}}
          @title={{this.combineButtonLabel}}
          @onClick={{action this.combineRide this.ride}}
        >
          {{paper-icon 'merge type'}}
        </PaperButton>
      {{/if}}
    {{/if}}
  </row.cell>
  <row.cell>
    <span class='cancellation'>
      <PaperButton
        @iconButton={{true}}
        @aria-label={{this.cancellationButtonLabel}}
        @title={{this.cancellationButtonLabel}}
        @onClick={{action this.editCancellation this.ride}}
      >
        {{#if this.ride.enabled}}
          {{paper-icon 'highlight off'}}
        {{else}}
          {{paper-icon this.cancellationIcon}}
        {{/if}}
      </PaperButton>
    </span>
    <PaperButton
      @iconButton={{true}}
      @aria-label='Edit ride'
      @title='Edit ride'
      class='edit'
      @onClick={{action this.editRide this.ride}}
    >
      {{paper-icon 'mode edit'}}
    </PaperButton>
  </row.cell>
</@body.row>

{{#each this.commitments as |commitment|}}
  <@body.row class='overlap highlighted' as |row|>
    {{row.cell}}
    <row.cell @colspan={{3}}>
      {{paper-icon 'date range'}}
      <span class='text'>
        {{commitment.person.name}} committed to slot {{commitment.timespan}}
      </span>
    </row.cell>
    <row.cell @colspan={{3}}>
      <PaperButton
        class='assign'
        @onClick={{action 'assignFromCommitment' commitment}}
      >
        Assign
      </PaperButton>
      <PaperButton
        class='ignore'
        @onClick={{action 'ignoreCommitment' commitment}}
      >
        Ignore
      </PaperButton>
    </row.cell>
  </@body.row>
{{/each}}

{{#if this.ride.requiresConfirmation}}
  <@body.row class='confirmation-notification highlighted' as |row|>
    {{row.cell}}
    <row.cell @colspan={{3}}>
      {{#if this.mediumIcon}}
        {{paper-icon this.mediumIcon title=this.mediumIconTitle}}
      {{/if}}
      <span>
        Contact visitor to confirm receipt of ride request
      </span>
    </row.cell>
    <row.cell @colspan={{3}}>
      <PaperButton class='mark-confirmed' @onClick={{action 'markConfirmed'}}>
        Mark as contacted
      </PaperButton>
    </row.cell>
  </@body.row>
{{/if}}

{{#if this.ride.requestNotes}}
  <@body.row class='notes' as |row|>
    {{row.cell}}
    <row.cell class='notes' @colspan={{6}}>
      {{this.ride.requestNotes}}
    </row.cell>
  </@body.row>
{{/if}}
{{#if this.ride.complete}}
  <@body.row class='report' as |row|>
    {{row.cell}}
    <row.cell @colspan={{6}}>
      {{paper-icon 'map'}}
      <span class='distance'>
        {{this.ride.distance}}
      </span>
      {{#if this.ride.carExpenses}}
        {{paper-icon 'local gas station'}}
        <span class='car-expenses'>
          {{this.ride.carExpensesDollars}}
        </span>
        {{#if (and this.ride.rate (not this.ride.overridable))}}
          (<span class='rate'>{{this.ride.rate}}<ReimbursementUnit /></span>)
        {{/if}}
      {{/if}}
      {{#if this.ride.foodExpenses}}
        {{paper-icon 'local cafe'}}
        <span class='food-expenses'>
          {{this.ride.foodExpensesDollars}}
        </span>
      {{/if}}
      {{#if this.ride.reportNotes}}
        {{paper-icon 'note'}}
        <span class='notes'>
          {{this.ride.reportNotes}}
        </span>
      {{/if}}
      {{#if this.clearing}}
        Clear this report?
        <PaperButton
          class='clear-confirm'
          @warn={{true}}
          @aria-label='Clear report'
          @title='Clear report'
          @onClick={{action 'clearReport'}}
        >
          Yes
        </PaperButton>
        <PaperButton
          class='clear-cancel'
          @aria-label='Don’t clear report'
          @title='Don’t clear report'
          @onClick={{action (mut this.clearing) false}}
        >
          No
        </PaperButton>
      {{else}}
        <PaperButton
          @iconButton={{true}}
          @aria-label='Clear report'
          @title='Clear report'
          @onClick={{action 'proposeClear'}}
        >
          {{paper-icon 'clear'}}
        </PaperButton>
      {{/if}}
    </row.cell>
  </@body.row>
{{/if}}
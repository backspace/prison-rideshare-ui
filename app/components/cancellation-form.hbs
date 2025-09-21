{{! template-lint-disable no-action }}
<PaperDialog @onClose={{this.cancel}} @clickOutsideToClose={{true}}>
  <PaperDialogContent>
    {{#if this.ride.children}}
      <PaperCard as |card|>
        <card.content>
          Cancelling a ride with rides combined into it will cause the combined rides to also disappear. Uncombine them if this is undesirable.
        </card.content>
      </PaperCard>
    {{/if}}

    <h2 class='md-title'>
      Cancel a ride
    </h2>

    <PaperForm @onSubmit={{this.save}} as |form|>
      <div class='layout layout-sm-column'>
        {{#each-in this.shortcutReasonToIcon as |reason icon|}}
          <PaperButton
            @raised={{true}}
            @class='shortcut'
            @onClick={{action 'cancelViaShortcut' reason}}
          >
            {{paper-icon icon}}
            {{reason}}
          </PaperButton>
        {{/each-in}}
      </div>

      <hr>

      <div class='layout layout-sm-column'>
        <PaperCheckbox
          @value={{this.ride.cancelled}}
          @onChange={{action 'cancelledChanged'}}
        >
          Cancelled?
        </PaperCheckbox>
      </div>

      <div class='layout layout-sm-column'>
        <PaperSelect
          @class='reason'
          @placeholder='Reason'
          @selected={{this.ride.cancellationReason}}
          @options={{this.reasons}}
          @onChange={{action (mut this.ride.cancellationReason)}} as |reason|
        >
          {{reason}}
        </PaperSelect>
      </div>

      <form.input
        @class='other'
        @label='Other reason'
        @value={{this.ride.cancellationReason}}
        @onChange={{action (mut this.ride.cancellationReason)}}
      />
    </PaperForm>
  </PaperDialogContent>

  <PaperDialogActions @class='layout-row'>
    <PaperButton @class='cancel' @onClick={{this.cancel}}>
      Cancel
    </PaperButton>
    <PaperButton @class='submit' @primary={{true}} @onClick={{this.save}}>
      Save
    </PaperButton>
  </PaperDialogActions>
</PaperDialog>
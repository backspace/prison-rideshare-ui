import PaperDialog from 'prison-rideshare-ui/components/placeholder';
import PaperDialogContent from 'prison-rideshare-ui/components/placeholder';
import PaperForm from 'prison-rideshare-ui/components/placeholder';
import PaperCheckbox from 'prison-rideshare-ui/components/placeholder';
import PaperDialogActions from 'prison-rideshare-ui/components/placeholder';
import PaperButton from 'prison-rideshare-ui/components/placeholder';
import { fn } from '@ember/helper';
<template>
  <PaperDialog @clickOutsideToClose={{true}} @onClose={{this.cancel}}>
    <PaperDialogContent>
      <h2 class='md-title'>
        {{if this.reimbursement.isNew 'Create' 'Edit'}}
        a reimbursement
      </h2>
      <PaperForm @onSubmit={{this.save}} as |form|>
        <div class='layout layout-sm-column'>
          <form.input
            @class='amount'
            @label='Amount'
            @type='number'
            @autofocus={{true}}
            @value={{this.reimbursement.amountDollars}}
            @onChange={{fn (mut this.reimbursement.amountDollars)}}
          />
        </div>

        <div class='layout layout-sm-column'>
          <PaperCheckbox
            @value={{this.reimbursement.donation}}
            @onChange={{fn (mut this.reimbursement.donation)}}
          >
            Donation?
          </PaperCheckbox>
        </div>
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
</template>

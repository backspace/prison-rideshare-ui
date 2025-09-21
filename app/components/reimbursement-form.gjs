import PaperDialog from "ember-paper/components/paper-dialog";
import PaperDialogContent from "ember-paper/components/paper-dialog-content";
import PaperForm from "ember-paper/components/paper-form";
import PaperCheckbox from "ember-paper/components/paper-checkbox";
import PaperDialogActions from "ember-paper/components/paper-dialog-actions";
import PaperButton from "ember-paper/components/paper-button";
<template>{{!-- template-lint-disable no-action --}}
<PaperDialog @clickOutsideToClose={{true}} @onClose={{this.cancel}}>
  <PaperDialogContent>
    <h2 class="md-title">
      {{if this.reimbursement.isNew "Create" "Edit"}} a reimbursement
    </h2>
    <PaperForm @onSubmit={{this.save}} as |form|>
      <div class="layout layout-sm-column">
        <form.input @class="amount" @label="Amount" @type="number" @autofocus={{true}} @value={{this.reimbursement.amountDollars}} @onChange={{action (mut this.reimbursement.amountDollars)}} />
      </div>

      <div class="layout layout-sm-column">
        <PaperCheckbox @value={{this.reimbursement.donation}} @onChange={{action (mut this.reimbursement.donation)}}>
          Donation?
        </PaperCheckbox>
      </div>
    </PaperForm>
  </PaperDialogContent>

  <PaperDialogActions @class="layout-row">
    <PaperButton @class="cancel" @onClick={{this.cancel}}>
      Cancel
    </PaperButton>
    <PaperButton @class="submit" @primary={{true}} @onClick={{this.save}}>
      Save
    </PaperButton>
  </PaperDialogActions>
</PaperDialog></template>

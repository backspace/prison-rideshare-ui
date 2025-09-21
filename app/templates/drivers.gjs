import RouteTemplate from 'ember-route-template'
import ToolbarHeader from "prison-rideshare-ui/components/toolbar-header";
import PaperButton from "ember-paper/components/paper-button";
import paperIcon from "ember-paper/components/paper-icon";
import PaperSwitch from "ember-paper/components/paper-switch";
import PaperDataTable from "paper-data-table/components/paper-data-table";
import sortBy from "ember-composable-helpers/helpers/sort-by";
import or from "ember-truth-helpers/helpers/or";
import PersonRow from "prison-rideshare-ui/components/person-row";
import ReimbursementForm from "prison-rideshare-ui/components/reimbursement-form";
import PaperDialog from "ember-paper/components/paper-dialog";
import PaperDialogContent from "ember-paper/components/paper-dialog-content";
import PaperForm from "ember-paper/components/paper-form";
import PaperRadioGroup from "ember-paper/components/paper-radio-group";
import PaperDialogActions from "ember-paper/components/paper-dialog-actions";
import { action } from "@ember/object";
export default RouteTemplate(<template>{{!-- template-lint-disable no-action --}}
<ToolbarHeader @title="Drivers">
  <PaperButton @mini={{true}} @aria-label="New driver" @title="New driver" @class="new" @onClick={{@controller.newPerson}}>
    {{paperIcon "add"}}
  </PaperButton>
</ToolbarHeader>

<div class="switch-container layout-row layout-align-start-center">
  <PaperSwitch @class="inactive" @value={{@controller.showInactive}} @onChange={{mut @controller.showInactive}}>
    Inactive
  </PaperSwitch>
</div>

<PaperDataTable @sortProp="name" @sortDir="asc" as |table|>
  <table.head as |head|>
    <head.column>
      Active
    </head.column>
    <head.column @sortProp="name" @class="name">
      Name
    </head.column>
    <head.column @class="email">
      Email
    </head.column>
    <head.column @class="mobile">
      Mobile
    </head.column>
    <head.column @class="landline">
      Landline
    </head.column>
    <head.column @class="address">
      Address
    </head.column>
    <head.column @sortProp="lastRide.start" @class="last-ride">
      Last ride
    </head.column>
    <head.column @class="notes">
      Notes
    </head.column>
    {{head.column}}
  </table.head>
  <table.body as |body|>
    {{#each (sortBy table.sortDesc @controller.model) as |person|}}
      {{#if (or person.active @controller.showInactive)}}
        {{#unless person.isNew}}
          <PersonRow @body={{body}} @person={{person}} @editPerson={{@controller.editPerson}} />
        {{/unless}}
      {{/if}}
    {{/each}}
  </table.body>
</PaperDataTable>

{{#if @controller.editingReimbursement}}
  <ReimbursementForm @reimbursement={{@controller.editingReimbursement}} @cancel={{@controller.cancel}} @save={{@controller.submitReimbursement}} />
{{/if}}

{{#if @controller.editingPerson}}
  <PaperDialog @clickOutsideToClose={{true}} @fullscreen={{true}} @onClose={{@controller.cancelPerson}}>
    <PaperDialogContent>
      <h2 class="md-title">
        {{if @controller.editingPerson.isNew "New" "Edit"}} person
      </h2>
      <PaperForm @onSubmit={{@controller.savePerson}} as |form|>
        <PaperRadioGroup @groupValue={{readonly @controller.editingPerson.medium}} @onChange={{mut @controller.editingPerson.medium}} as |group|>
          <div class="layout layout-sm-column">
            <form.input @class="name" @label="Name" @autofocus={{true}} @value={{@controller.editingPerson.name}} @onChange={{mut @controller.editingPerson.name}} @errors={{@controller.editingPerson.validationErrors.name}} @isTouched={{readonly @controller.editingPerson.validationErrors.name.length}} />
          </div>
          <div class="layout layout-sm-column text-radio email">
            <form.input @type="email" @label="Email" @value={{@controller.editingPerson.email}} @onChange={{mut @controller.editingPerson.email}} @errors={{@controller.editingPerson.validationErrors.email}} @isTouched={{readonly @controller.editingPerson.validationErrors.email.length}} />
            <group.radio @value="email">
              {{paperIcon "favorite"}}
            </group.radio>
          </div>
          <div class="layout layout-sm-column text-radio mobile">
            <form.input @type="mobile" @label="Mobile" @value={{@controller.editingPerson.mobile}} @onChange={{mut @controller.editingPerson.mobile}} @errors={{@controller.editingPerson.validationErrors.mobile}} @isTouched={{readonly @controller.editingPerson.validationErrors.mobile.length}} />
            <group.radio @value="mobile">
              {{paperIcon "favorite"}}
            </group.radio>
          </div>
          <div class="layout layout-sm-column text-radio landline">
            <form.input @type="mobile" @label="Landline" @value={{@controller.editingPerson.landline}} @onChange={{mut @controller.editingPerson.landline}} @errors={{@controller.editingPerson.validationErrors.landline}} @isTouched={{readonly @controller.editingPerson.validationErrors.landline.length}} />
            <group.radio @value="landline">
              {{paperIcon "favorite"}}
            </group.radio>
          </div>
          <div class="layout layout-sm-column">
            <form.input @textarea={{true}} @class="address" @label="Mailing address" @value={{@controller.editingPerson.address}} @onChange={{mut @controller.editingPerson.address}} @errors={{@controller.editingPerson.validationErrors.address}} @isTouched={{readonly @controller.editingPerson.validationErrors.address.length}} />
          </div>
          <div class="layout layout-sm-column">
            <form.input @textarea={{true}} @class="notes" @label="Notes" @value={{@controller.editingPerson.notes}} @onChange={{mut @controller.editingPerson.notes}} @errors={{@controller.editingPerson.validationErrors.notes}} @isTouched={{readonly @controller.editingPerson.validationErrors.notes.length}} />
          </div>
        </PaperRadioGroup>
      </PaperForm>
    </PaperDialogContent>

    <PaperDialogActions @class="layout-row">
      <PaperButton @class="cancel" @onClick={{@controller.cancelPerson}}>
        Cancel
      </PaperButton>
      <PaperButton @class="submit" @primary={{true}} @onClick={{@controller.savePerson}}>
        Save
      </PaperButton>
    </PaperDialogActions>
  </PaperDialog>
{{/if}}</template>)

import RouteTemplate from 'ember-route-template'
import ToolbarHeader from "prison-rideshare-ui/components/toolbar-header";
import PaperContent from "ember-paper/components/paper-content/component";
import PaperDataTable from "paper-data-table/components/paper-data-table";
import CopyButton from "ember-cli-clipboard/components/copy-button";
import paperIcon from "ember-paper/components/paper-icon";
import DonationIcon from "prison-rideshare-ui/components/donation-icon";
import PaperButton from "ember-paper/components/paper-button";
import not from "ember-truth-helpers/helpers/not";
import PaperSwitch from "ember-paper/components/paper-switch";
import momentFormat from "ember-moment/helpers/moment-format";
import and from "ember-truth-helpers/helpers/and";
import ReimbursementForm from "prison-rideshare-ui/components/reimbursement-form";
import { action } from "@ember/object";
import { fn } from '@ember/helper';
export default RouteTemplate(<template>{{!-- template-lint-disable no-action --}}
<ToolbarHeader @title="Reimbursements" />

<PaperContent>
  {{#if @controller.monthReimbursementCollections}}
    <PaperDataTable @class="reimbursements layout-row" as |table|>
      <table.head as |head|>
        <head.column>
          Person
        </head.column>
        <head.column>
          Food
        </head.column>
        <head.column>
          Car
        </head.column>
        <head.column>
          Total
        </head.column>
        {{head.column}}
      </table.head>
      <table.body as |body|>
        {{#each @controller.monthReimbursementCollections as |monthReimbursementCollection|}}
          <body.row as |row|>
            <row.cell @class="month" @colspan={{4}}>
              {{monthReimbursementCollection.monthName}}
            </row.cell>
            <row.cell>
              <CopyButton @text={{monthReimbursementCollection.clipboardText}}>
                {{paperIcon "content copy" title=monthReimbursementCollection.copyIconTitle}}
              </CopyButton>
            </row.cell>
          </body.row>
          {{#each monthReimbursementCollection.reimbursementCollections as |reimbursementCollection|}}
            {{#if reimbursementCollection.reimbursements}}
              <body.row @class="person" as |row|>
                <row.cell @class="name">
                  {{#if reimbursementCollection.showName}}
                    {{reimbursementCollection.person.name}}
                  {{/if}}
                </row.cell>
                <row.cell @class="food-expenses">
                  {{#unless reimbursementCollection.donations}}
                    {{reimbursementCollection.foodExpensesDollars}}
                  {{/unless}}
                </row.cell>
                <row.cell>
                  <span class="car-expenses">
                    {{reimbursementCollection.carExpensesDollars}}
                  </span>
                  {{#if reimbursementCollection.donations}}
                    <DonationIcon />
                  {{/if}}
                </row.cell>
                <row.cell @class="total-expenses">
                  {{reimbursementCollection.totalExpensesDollars}}
                </row.cell>
                <row.cell>
                  <CopyButton @text={{reimbursementCollection.clipboardText}}>
                    {{paperIcon "content copy" title=reimbursementCollection.copyIconTitle}}
                  </CopyButton>
                  <PaperButton @class="process" @primary={{not reimbursementCollection.donations}} @onClick={{fn @controller.processReimbursements reimbursementCollection}}>
                    Process
                  </PaperButton>
                  <PaperButton @class="donate" @primary={{reimbursementCollection.donations}} @onClick={{fn @controller.processReimbursements reimbursementCollection true}}>
                    Donate
                  </PaperButton>
                </row.cell>
              </body.row>
            {{/if}}
          {{/each}}
        {{/each}}
      </table.body>
    </PaperDataTable>
  {{else}}
    <PaperDataTable as |table|>
      <table.body as |body|>
        <body.row as |row|>
          <row.cell @class="no-reimbursements">
            There are no unprocessed reimbursements to view.
          </row.cell>
        </body.row>
      </table.body>
    </PaperDataTable>
  {{/if}}
  <PaperSwitch @class="processed layout-row" @value={{@controller.showProcessed}} @onChange={{mut @controller.showProcessed}}>
    Show processed reimbursements
  </PaperSwitch>
  {{#if @controller.showProcessed}}
    <PaperDataTable @class="layout-row" as |table|>
      <table.head as |head|>
        <head.column>
          Date
        </head.column>
        <head.column>
          Person
        </head.column>
        <head.column>
          Ride
        </head.column>
        <head.column>
          Expense
        </head.column>
        <head.column>
          Donation?
        </head.column>
      </table.head>
      <table.body as |body|>
        {{#each @controller.processedReimbursements as |reimbursement|}}
          <body.row @class="reimbursement" as |row|>
            <row.cell @class="date">
              {{momentFormat reimbursement.insertedAt "YYYY-MM-DD"}}
            </row.cell>
            <row.cell @class="name">
              {{reimbursement.person.name}}
            </row.cell>
            <row.cell @class="ride">
              {{#if (and reimbursement.ride.start reimbursement.ride.institution.name)}}
                {{momentFormat reimbursement.ride.start "YYYY-MM-DD"}} to {{reimbursement.ride.institution.name}}
              {{/if}}
            </row.cell>
            <row.cell @class="expenses">
              {{#if reimbursement.foodExpensesDollars}}
                {{paperIcon "local cafe"}}
                <span>
                  {{reimbursement.foodExpensesDollars}}
                </span>
              {{else}}
                {{paperIcon "local gas station"}}
                <span>
                  {{reimbursement.carExpensesDollars}}
                </span>
              {{/if}}
            </row.cell>
            <row.cell @class="donation">
              {{#if reimbursement.donation}}
                {{paperIcon "done"}}
              {{/if}}
            </row.cell>
          </body.row>
        {{/each}}
      </table.body>
    </PaperDataTable>
  {{/if}}
</PaperContent>
{{#if @controller.editingReimbursement}}
  <ReimbursementForm @reimbursement={{@controller.editingReimbursement}} @cancel={{this.cancel}} @save={{this.submitReimbursement}} />
{{/if}}</template>)

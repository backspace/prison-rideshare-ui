import RouteTemplate from 'ember-route-template'
import ToolbarHeader from "prison-rideshare-ui/components/toolbar-header";
import PaperButton from "ember-paper/components/paper-button";
import paperIcon from "ember-paper/_app_/components/paper-icon.js";
import PaperInput from "ember-paper/_app_/components/paper-input.js";
import PaperSwitch from "ember-paper/_app_/components/paper-switch.js";
import PaperContent from "ember-paper/components/paper-content/component";
import PaperDataTable from "paper-data-table/components/paper-data-table";
import filterBy from "ember-composable-helpers/helpers/filter-by";
import sortBy from "ember-composable-helpers/helpers/sort-by";
import RideRow from "prison-rideshare-ui/components/ride-row";
import RideForm from "prison-rideshare-ui/components/ride-form";
import CancellationForm from "prison-rideshare-ui/components/cancellation-form";
export default RouteTemplate(<template>{{!-- template-lint-disable no-action --}}
<ToolbarHeader @title="Rides">
  <PaperButton @mini={{true}} @aria-label="New ride" @title="New ride" class="new" @onClick={{action "newRide"}}>
    {{paperIcon "add"}}
  </PaperButton>
</ToolbarHeader>

<div class="switch-container layout-row layout-align-start-center">
  <PaperInput class="search" @type="search" @icon="search" @placeholder="Institution, driver, visitor, address" @value={{@controller.search}} @onChange={{action (mut @controller.search)}} as |input|>
    {{#if input.hasValue}}
      <PaperButton @icon={{true}} @aria-label="Clear search" @title="Clear search" @onClick={{action "clearSearch"}}>
        {{paperIcon "clear" size=14}}
      </PaperButton>
    {{/if}}
  </PaperInput>
  <PaperSwitch class="completed" @value={{@controller.showCompleted}} @onChange={{action (mut @controller.showCompleted)}}>
    Reported-on
  </PaperSwitch>
  <PaperSwitch class="cancelled" @value={{@controller.showCancelled}} @onChange={{action (mut @controller.showCancelled)}}>
    Cancelled
  </PaperSwitch>
</div>

<PaperContent class="layout-column flex no-overflow-scroll">
  <PaperDataTable @sortProp={{@controller.sortProp}} @sortDir={{@controller.sortDir}} class="rides" as |table|>
    <table.head as |head|>
      {{#if @controller.showCreation}}
        <head.column>
          Created
        </head.column>
      {{/if}}
      <head.column @sortProp="start" class="date">
        Date
      </head.column>
      <head.column>
        Institution
      </head.column>
      <head.column>
        Visitor
      </head.column>
      <head.column>
        Pickup address
      </head.column>
      <head.column>
        Driver/car owner
      </head.column>
      <head.column />
    </table.head>
    <table.body as |body|>
      {{#each (filterBy "id" (sortBy table.sortDesc @controller.filteredRides)) as |ride|}}
        <RideRow @body={{body}} @ride={{ride}} @showCreation={{@controller.showCreation}} @editCancellation={{action "editCancellation"}} @editRide={{action "editRide"}} @combineRide={{action "combineRide"}} @uncombineRide={{action "uncombineRide"}} @people={{@controller.people}} @rideToCombine={{@controller.rideToCombine}} />
        {{#each ride.children as |child|}}
          <RideRow @body={{body}} @ride={{child}} @combined={{true}} @showCreation={{@controller.showCreation}} @editCancellation={{action "editCancellation"}} @editRide={{action "editRide"}} @combineRide={{action "combineRide"}} @uncombineRide={{action "uncombineRide"}} @people={{@controller.people}} @rideToCombine={{@controller.rideToCombine}} />
        {{/each}}
      {{else}}
        <body.row class="no-matches" as |row|>
          <row.cell @colspan={{6}}>
            {{!-- template-lint-disable no-html-comments --}}
            No rides matched your criteria. 😭<!-- FIXME WTF! Without this, the institutions select in the dialogue has no options? {{filteredRides.length}} -->
          </row.cell>
        </body.row>
      {{/each}}
    </table.body>
  </PaperDataTable>

  {{#if @controller.editingRide}}
    <RideForm @ride={{@controller.editingRide}} @cancel={{action "cancel" @controller.editingRide}} @save={{action "submitRide" @controller.editingRide}} />
  {{/if}}

  {{#if @controller.editingCancellation}}
    <CancellationForm @ride={{@controller.editingCancellation}} @save={{action "submitCancellation" @controller.editingCancellation}} @cancel={{action "cancelCancellation" @controller.editingCancellation}} />
  {{/if}}
</PaperContent></template>)
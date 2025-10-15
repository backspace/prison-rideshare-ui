import RouteTemplate from 'ember-route-template';
import ToolbarHeader from 'prison-rideshare-ui/components/toolbar-header';
import RideRow from 'prison-rideshare-ui/components/ride-row';
import RideForm from 'prison-rideshare-ui/components/ride-form';
import CancellationForm from 'prison-rideshare-ui/components/cancellation-form';
import {
  HdsButton,
  HdsFormToggleField,
} from '@hashicorp/design-system-components/components';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';

export default RouteTemplate(
  <template>
    <ToolbarHeader @title='Rides'>
      <HdsButton
        @icon='plus'
        @text='New ride'
        data-test-new-ride
        {{on 'click' @controller.newRide}}
      />
    </ToolbarHeader>

    <div data-test-ride-search>
      <label class='sr-only' for='ride-search-input'>Search</label>
      <input
        id='ride-search-input'
        type='search'
        placeholder='Institution, driver, visitor, address'
        value={{if @controller.search @controller.search ''}}
        {{on 'input' @controller.updateSearchInput}}
      />
      {{#if @controller.search}}
        <HdsButton
          @icon='x'
          @text='Clear search'
          data-test-ride-search-clear
          {{on 'click' @controller.clearSearch}}
        />
      {{/if}}
    </div>
    <HdsFormToggleField
      data-test-show-completed
      checked={{if @controller.showCompleted true undefined}}
      {{on 'change' (fn @controller.toggle 'showCompleted')}}
      as |Field|
    >
      <Field.Label>Reported-on</Field.Label>
    </HdsFormToggleField>
    <HdsFormToggleField
      data-test-show-cancelled
      checked={{if @controller.showCancelled true undefined}}
      {{on 'change' (fn @controller.toggle 'showCancelled')}}
      as |Field|
    >
      <Field.Label>Cancelled</Field.Label>
    </HdsFormToggleField>

    <table>
      <thead>
        <tr>
          {{#if @controller.showCreation}}
            <th scope='col'>Created</th>
          {{/if}}
          <th
            scope='col'
            class='date'
            data-test-rides-head-date
            {{on 'click' (fn @controller.sort 'start')}}
          >
            Date
          </th>
          <th scope='col'>Institution</th>
          <th scope='col'>Visitor</th>
          <th scope='col'>Pickup address</th>
          <th scope='col'>Driver/car owner</th>
          <th scope='col'></th>
        </tr>
      </thead>
      <tbody>
        {{#each @controller.filteredRides as |ride|}}
          <RideRow
            @ride={{ride}}
            @showCreation={{@controller.showCreation}}
            @editCancellation={{@controller.editCancellation}}
            @editRide={{@controller.editRide}}
            @combineRide={{@controller.combineRide}}
            @uncombineRide={{@controller.uncombineRide}}
            @people={{@controller.people}}
            @rideToCombine={{@controller.rideToCombine}}
          />
          {{#each ride.children as |child|}}
            <RideRow
              @ride={{child}}
              @combined={{true}}
              @showCreation={{@controller.showCreation}}
              @editCancellation={{@controller.editCancellation}}
              @editRide={{@controller.editRide}}
              @combineRide={{@controller.combineRide}}
              @uncombineRide={{@controller.uncombineRide}}
              @people={{@controller.people}}
              @rideToCombine={{@controller.rideToCombine}}
            />
          {{/each}}
        {{else}}
          <tr data-test-no-matches>
            <td colspan='7'>
              No rides matched your criteria.
            </td>
          </tr>
        {{/each}}
      </tbody>
    </table>

    {{#if @controller.editingRide}}
      <RideForm
        @ride={{@controller.editingRide}}
        @cancel={{fn @controller.cancel @controller.editingRide}}
        @save={{fn @controller.submitRide @controller.editingRide}}
      />
    {{/if}}

    {{#if @controller.editingCancellation}}
      <CancellationForm
        @ride={{@controller.editingCancellation}}
        @save={{fn
          @controller.submitCancellation
          @controller.editingCancellation
        }}
        @cancel={{fn
          @controller.cancelCancellation
          @controller.editingCancellation
        }}
      />
    {{/if}}
  </template>,
);

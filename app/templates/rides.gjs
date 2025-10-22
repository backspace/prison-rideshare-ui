import RouteTemplate from 'ember-route-template';
import ToolbarHeader from 'prison-rideshare-ui/components/toolbar-header';
import RideRow from 'prison-rideshare-ui/components/ride-row';
import RideForm from 'prison-rideshare-ui/components/ride-form';
import CancellationForm from 'prison-rideshare-ui/components/cancellation-form';
import {
  HdsButton,
  HdsForm,
  HdsFormSectionMultiFieldGroup,
  HdsFormTextInputBase,
  HdsFormToggleField,
  HdsTable,
} from '@hashicorp/design-system-components/components';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';
import eq from 'ember-truth-helpers/helpers/eq';

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

    <HdsFormSectionMultiFieldGroup class='rides-filters' as |Group|>
      <Group.Item @width='30rem'>
        <div>
          <label class='sr-only' for='ride-search-input'>Search</label>
          <HdsFormTextInputBase
            data-test-ride-search
            id='ride-search-input'
            type='search'
            placeholder='Institution, driver, visitor, address'
            value={{if @controller.search @controller.search ''}}
            {{on 'input' @controller.updateSearchInput}}
          />
        </div>
      </Group.Item>
      <Group.Item>
        <HdsFormToggleField
          data-test-show-completed
          checked={{if @controller.showCompleted true undefined}}
          {{on 'change' (fn @controller.toggle 'showCompleted')}}
          as |Field|
        >
          <Field.Label>Reported-on</Field.Label>
        </HdsFormToggleField>
      </Group.Item>
      <Group.Item>
        <HdsFormToggleField
          data-test-show-cancelled
          checked={{if @controller.showCancelled true undefined}}
          {{on 'change' (fn @controller.toggle 'showCancelled')}}
          as |Field|
        >
          <Field.Label>Cancelled</Field.Label>
        </HdsFormToggleField>
      </Group.Item>
    </HdsFormSectionMultiFieldGroup>

    <HdsTable
      class='rides'
      @isSortable={{true}}
      @sortBy={{@controller.sortProp}}
      @sortOrder={{@controller.sortDir}}
    >
      <:head as |Head|>
        <Head.Tr>
          {{#if @controller.showCreation}}
            <Head.Th>Created</Head.Th>
          {{/if}}
          <Head.ThSort
            class='date'
            data-test-rides-head-date
            @sortOrder={{if
              (eq @controller.sortProp 'start')
              @controller.sortDir
            }}
            @onClickSort={{fn @controller.sort 'start'}}
          >
            Date
          </Head.ThSort>
          <Head.Th>Institution</Head.Th>
          <Head.Th>Visitor</Head.Th>
          <Head.Th>Pickup address</Head.Th>
          <Head.Th>Driver/car owner</Head.Th>
          <Head.Th />
        </Head.Tr>
      </:head>

      <:body as |Body|>
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
            @table={{Body}}
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
              @table={{Body}}
            />
          {{/each}}
        {{else}}
          <Body.Tr data-test-no-matches>
            <Body.Td colspan={{if @controller.showCreation '7' '6'}}>
              No rides matched your criteria.
            </Body.Td>
          </Body.Tr>
        {{/each}}
      </:body>
    </HdsTable>

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

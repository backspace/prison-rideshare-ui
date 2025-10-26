import RouteTemplate from 'ember-route-template';
import ToolbarHeader from 'prison-rideshare-ui/components/toolbar-header';
import eq from 'ember-truth-helpers/helpers/eq';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';
import {
  HdsAdvancedTable,
  HdsBadge,
  HdsButton,
} from '@hashicorp/design-system-components/components';

export default RouteTemplate(
  <template>
    <ToolbarHeader @title='Debts' />

    <HdsAdvancedTable
      @columns={{@controller.tableColumns}}
      @model={{@controller.tableRows}}
      data-test-debts-table
    >
      <:body as |Body|>
        {{#if (eq Body.data.type 'person')}}
          <Body.Tr
            class='person'
            data-test-debt-person-row
            data-test-person-id={{Body.data.person.id}}
          >
            <Body.Th data-test-debt-person-name>
              {{Body.data.person.name}}
            </Body.Th>
            <Body.Td class='food-expenses' data-test-debt-person-food>
              {{Body.data.food}}
            </Body.Td>
            <Body.Td class='car-expenses' data-test-debt-person-car>
              {{Body.data.car}}
            </Body.Td>
            <Body.Td class='total-expenses' data-test-debt-person-total>
              {{Body.data.total}}
            </Body.Td>
            <Body.Td>
              <HdsButton
                @text='Reimburse'
                @size='small'
                data-test-debt-reimburse
                {{on 'click' (fn @controller.reimburse Body.data.debt)}}
              />
            </Body.Td>
          </Body.Tr>
        {{else if (eq Body.data.type 'ride')}}
          <Body.Tr
            class='ride'
            data-test-debt-ride-row
            data-test-ride-id={{Body.data.ride.id}}
            data-test-driver-id={{Body.data.ride.driver.id}}
            data-test-car-owner-id={{Body.data.ride.carOwner.id}}
          >
            <Body.Td data-test-debt-ride-date>
              {{Body.data.ride.rideTimes}}
            </Body.Td>
            <Body.Td class='food-expenses'>
              <span data-test-debt-ride-food>{{Body.data.food}}</span>
              {{#if Body.data.foodReimbursed}}
                <ReimbursementBadge
                  @amount={{Body.data.foodReimbursed}}
                  data-test-debt-ride-food-reimbursed
                />
              {{/if}}
            </Body.Td>
            <Body.Td class='car-expenses' data-test-debt-ride-car>
              <span data-test-debt-ride-car>{{Body.data.car}}</span>
              {{#if Body.data.carReimbursed}}
                <ReimbursementBadge
                  @amount={{Body.data.carReimbursed}}
                  data-test-debt-ride-car-reimbursed
                />
              {{/if}}
              {{#if Body.data.donation}}
                <HdsBadge
                  @text='Donation'
                  @type='outlined'
                  @size='small'
                  data-test-debt-ride-donation
                />
              {{/if}}
            </Body.Td>
            <Body.Td />
            <Body.Td />
          </Body.Tr>
        {{/if}}
      </:body>
    </HdsAdvancedTable>
  </template>,
);

const ReimbursementBadge = <template>
  <HdsBadge
    @text='-{{@amount}}'
    @type='outlined'
    @size='small'
    title='{{@amount}} has already been reimbursed'
    ...attributes
  />
</template>;

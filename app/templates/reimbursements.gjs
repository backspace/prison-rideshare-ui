import RouteTemplate from 'ember-route-template';
import ToolbarHeader from 'prison-rideshare-ui/components/toolbar-header';
import momentFormat from 'ember-moment/helpers/moment-format';
import and from 'ember-truth-helpers/helpers/and';
import ReimbursementForm from 'prison-rideshare-ui/components/reimbursement-form';
import { fn, hash } from '@ember/helper';
import { on } from '@ember/modifier';
import eq from 'ember-truth-helpers/helpers/eq';
import {
  HdsAdvancedTable,
  HdsBadge,
  HdsButton,
  HdsCopyButton,
  HdsFormToggleField,
  HdsIcon,
  HdsTable,
} from '@hashicorp/design-system-components/components';

export default RouteTemplate(
  <template>
    <div data-test-reimbursements-page>
      <ToolbarHeader @title='Reimbursements' />

      {{#if @controller.monthTableRows.length}}
        <HdsAdvancedTable
          @columns={{@controller.monthTableColumns}}
          @model={{@controller.monthTableRows}}
          @options={{hash hasStickyHeader=true}}
          data-test-reimbursements-table
        >
          <:body as |Body|>
            {{#if (eq Body.data.type 'month')}}
              <Body.Tr
                class='month-row'
                data-test-reimbursement-row
                data-row-type='month'
              >
                <Body.Th
                  class='month'
                  colspan={{4}}
                  data-test-reimbursement-month
                >
                  {{Body.data.monthName}}
                </Body.Th>
                <Body.Td class='actions'>
                  {{#if Body.data.clipboardText}}
                    <HdsCopyButton
                      type='button'
                      data-test-clipboard-text={{Body.data.clipboardText}}
                      @textToCopy={{Body.data.clipboardText}}
                      @isIconOnly={{true}}
                      @color='secondary'
                      @size='small'
                      @text={{Body.data.copyIconTitle}}
                      data-test-reimbursement-copy
                    />
                  {{/if}}
                </Body.Td>
              </Body.Tr>
            {{else}}
              <Body.Tr
                class='person-row'
                data-test-reimbursement-row
                data-row-type='person'
              >
                <Body.Th class='name' data-test-reimbursement-name>
                  {{Body.data.name}}
                </Body.Th>
                <Body.Td class='food-expenses' data-test-reimbursement-food>
                  {{Body.data.foodExpenses}}
                </Body.Td>
                <Body.Td class='car-expenses' data-test-reimbursement-car>
                  <span data-test-reimbursement-car-value>
                    {{Body.data.carExpenses}}
                  </span>
                  {{#if Body.data.isDonation}}
                    <HdsBadge
                      @text='Donation'
                      @type='outlined'
                      @size='small'
                      data-test-reimbursement-donation
                    />
                  {{/if}}
                </Body.Td>
                <Body.Td class='total-expenses' data-test-reimbursement-total>
                  {{Body.data.totalExpenses}}
                </Body.Td>
                <Body.Td class='actions'>
                  <HdsCopyButton
                    data-test-clipboard-text={{Body.data.clipboardText}}
                    data-test-reimbursement-copy
                    @textToCopy={{Body.data.clipboardText}}
                    @isIconOnly={{true}}
                    @color='secondary'
                    @size='small'
                    @text={{Body.data.copyIconTitle}}
                  />
                  <HdsButton
                    type='button'
                    @text='Process'
                    @color={{if Body.data.isDonation 'secondary' 'primary'}}
                    data-test-reimbursement-process
                    data-variant={{if
                      Body.data.isDonation
                      'secondary'
                      'primary'
                    }}
                    {{on
                      'click'
                      (fn
                        @controller.processReimbursements
                        Body.data.reimbursementCollection
                      )
                    }}
                  />
                  <HdsButton
                    type='button'
                    @text='Donate'
                    @color={{if Body.data.isDonation 'primary' 'secondary'}}
                    data-test-reimbursement-donate
                    data-variant={{if
                      Body.data.isDonation
                      'primary'
                      'secondary'
                    }}
                    {{on
                      'click'
                      (fn
                        @controller.processReimbursements
                        Body.data.reimbursementCollection
                        true
                      )
                    }}
                  />
                </Body.Td>
              </Body.Tr>
            {{/if}}
          </:body>
        </HdsAdvancedTable>
      {{else}}
        <div class='no-reimbursements' data-test-no-reimbursements>
          There are no unprocessed reimbursements to view.
        </div>
      {{/if}}

      <HdsFormToggleField
        class='processed-toggle'
        checked={{@controller.showProcessed}}
        data-test-reimbursements-processed-toggle
        {{on 'change' @controller.toggleShowProcessed}}
        as |Field|
      >
        <Field.Label>Show processed reimbursements</Field.Label>
      </HdsFormToggleField>

      {{#if @controller.showProcessed}}
        <HdsTable data-test-reimbursements-processed-table>
          <:head as |Head|>
            <Head.Tr>
              <Head.Th>Date</Head.Th>
              <Head.Th>Person</Head.Th>
              <Head.Th>Ride</Head.Th>
              <Head.Th>Expense</Head.Th>
              <Head.Th>Donation?</Head.Th>
            </Head.Tr>
          </:head>
          <:body as |Body|>
            {{#each @controller.processedTableRows as |row|}}
              <Body.Tr
                class='reimbursement'
                data-test-processed-row
                data-reimbursement-id={{row.id}}
              >
                <Body.Td class='date' data-test-processed-date>
                  {{momentFormat row.date 'YYYY-MM-DD'}}
                </Body.Td>
                <Body.Td class='name' data-test-processed-name>
                  {{row.name}}
                </Body.Td>
                <Body.Td class='ride' data-test-processed-ride>
                  {{#if (and row.ride.start row.ride.institution.name)}}
                    {{momentFormat row.ride.start 'YYYY-MM-DD'}}
                    to
                    {{row.ride.institution.name}}
                  {{/if}}
                </Body.Td>
                <Body.Td class='expenses' data-test-processed-expense>
                  {{#if row.foodExpensesDollars}}
                    <HdsIcon
                      @name='wall'
                      @size='16'
                      data-test-processed-expense-icon='food'
                    />
                    <span data-test-processed-expense-value>
                      {{row.foodExpensesDollars}}
                    </span>
                  {{else}}
                    <HdsIcon
                      @name='truck'
                      @size='16'
                      data-test-processed-expense-icon='car'
                    />
                    <span data-test-processed-expense-value>
                      {{row.carExpensesDollars}}
                    </span>
                  {{/if}}
                </Body.Td>
                <Body.Td class='donation' data-test-processed-donation>
                  {{#if row.donation}}
                    <HdsIcon
                      @name='check'
                      @size='16'
                      data-test-processed-donation-icon
                    />
                  {{/if}}
                </Body.Td>
              </Body.Tr>
            {{/each}}
          </:body>
        </HdsTable>
      {{/if}}

      {{#if @controller.editingReimbursement}}
        <ReimbursementForm
          @reimbursement={{@controller.editingReimbursement}}
          @cancel={{this.cancel}}
          @save={{this.submitReimbursement}}
        />
      {{/if}}
    </div>
  </template>,
);

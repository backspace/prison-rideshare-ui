import RouteTemplate from 'ember-route-template';
import RequestsAndReimbursementsChart from 'prison-rideshare-ui/components/requests-and-reimbursements-chart';
import RequestTimeChart from 'prison-rideshare-ui/components/request-time-chart';
import CancellationChart from 'prison-rideshare-ui/components/cancellation-chart';
import { fn } from '@ember/helper';
import { on } from '@ember/modifier';
import eq from 'ember-truth-helpers/helpers/eq';
import { pageTitle } from 'ember-page-title';
import {
  HdsButton,
  HdsCardContainer,
  HdsCopyButton,
  HdsForm,
  HdsFormRadioGroup,
  HdsFormTextInputField,
} from '@hashicorp/design-system-components/components';

export default RouteTemplate(
  <template>
    {{pageTitle 'Statistics'}}

    <div class='statistics-page layout-column flex' data-test-statistics-page>
      <HdsCardContainer class='statistics-card' data-test-statistics-card>
        <HdsForm as |Form|>
          <Form.Section>
            <div class='inputs'>
              <HdsFormTextInputField
                @value={{@controller.start}}
                @type='date'
                data-test-statistics-start
                {{on 'input' @controller.updateStart}}
                as |Field|
              >
                <Field.Label>Chart data begins</Field.Label>
              </HdsFormTextInputField>

              <HdsFormTextInputField
                @value={{@controller.end}}
                @type='date'
                data-test-statistics-end
                {{on 'input' @controller.updateEnd}}
                as |Field|
              >
                <Field.Label>Chart data ends</Field.Label>
              </HdsFormTextInputField>
            </div>
          </Form.Section>

          <Form.Section>
            <div class='buttons'>
              <HdsButton
                type='button'
                @text='Past year'
                @color='secondary'
                data-test-statistics-past-year
                {{on 'click' @controller.setPastYear}}
              />
              <HdsButton
                type='button'
                @text='Past two weeks'
                @color='secondary'
                data-test-statistics-past-two-weeks
                {{on 'click' @controller.setPastTwoWeeks}}
              />
              <HdsButton
                type='button'
                @text='This year'
                @color='secondary'
                data-test-statistics-this-year
                {{on 'click' @controller.setThisYear}}
              />
            </div>
          </Form.Section>

          <Form.Section>
            <div class='radios'>
              <span class='radios-label'>Count</span>
              <HdsFormRadioGroup
                name='statistics-count'
                data-test-statistics-grouping
                as |Group|
              >
                <Group.RadioField
                  @value='rides'
                  checked={{eq @controller.grouping 'rides'}}
                  data-test-statistics-grouping-option='rides'
                  {{on 'change' (fn @controller.setGrouping 'rides')}}
                  as |F|
                >
                  <F.Label>Rides</F.Label>
                </Group.RadioField>
                <Group.RadioField
                  @value='passengers'
                  checked={{eq @controller.grouping 'passengers'}}
                  data-test-statistics-grouping-option='passengers'
                  {{on 'change' (fn @controller.setGrouping 'passengers')}}
                  as |F|
                >
                  <F.Label>Passengers</F.Label>
                </Group.RadioField>
              </HdsFormRadioGroup>
            </div>
          </Form.Section>
        </HdsForm>
      </HdsCardContainer>

      <RequestsAndReimbursementsChart
        @rides={{@controller.rides}}
        @theme={{@controller.theme}}
        @grouping={{@controller.grouping}}
      />

      <RequestTimeChart
        @rides={{@controller.rides}}
        @theme={{@controller.theme}}
        @grouping={{@controller.grouping}}
      />

      <CancellationChart
        @rides={{@controller.rides}}
        @theme={{@controller.theme}}
        @grouping={{@controller.grouping}}
      />

      <div class='copy-button'>
        <HdsCopyButton
          type='button'
          @textToCopy={{@controller.clipboardText}}
          @iconOnly={{true}}
          @color='secondary'
          @text='Copy for report'
          data-test-statistics-copy
        />
      </div>
    </div>
  </template>,
);

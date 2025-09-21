import RouteTemplate from 'ember-route-template';
import PaperContent from 'ember-paper/components/paper-content/component';
import PaperCard from 'ember-paper/components/paper-card';
import PaperInput from 'ember-paper/components/paper-input';
import PaperButton from 'ember-paper/components/paper-button';
import PaperRadioGroup from 'ember-paper/components/paper-radio-group';
import RequestsAndReimbursementsChart from 'prison-rideshare-ui/components/requests-and-reimbursements-chart';
import RequestTimeChart from 'prison-rideshare-ui/components/request-time-chart';
import CancellationChart from 'prison-rideshare-ui/components/cancellation-chart';
import CopyButton from 'ember-cli-clipboard/components/copy-button';
import paperIcon from 'ember-paper/components/paper-icon';
import { action } from '@ember/object';
import { fn } from '@ember/helper';
import { pageTitle } from 'ember-page-title';

export default RouteTemplate(
  <template>
    {{! template-lint-disable no-action }}
    {{pageTitle 'Statistics'}}
    <PaperContent @class='layout-column flex'>
      <PaperCard @class='statistics-card' as |card|>
        <card.content>
          <div class='inputs'>
            <PaperInput
              @class='start'
              @type='date'
              @label='Chart data begins'
              @value={{@controller.start}}
              @onChange={{fn (mut @controller.start)}}
            />

            <PaperInput
              @class='end'
              @type='date'
              @label='Chart data ends'
              @value={{@controller.end}}
              @onChange={{fn (mut @controller.end)}}
            />
          </div>

          <div class='buttons'>
            <PaperButton
              @class='past-year'
              @label='Past year'
              @onClick={{@controller.setPastYear}}
            />
            <PaperButton
              @class='past-two-weeks'
              @label='Past two weeks'
              @onClick={{@controller.setPastTwoWeeks}}
            />
            <PaperButton
              @class='this-year'
              @label='This year'
              @onClick={{@controller.setThisYear}}
            />
          </div>

          <div class='radios'>
            Count
            <PaperRadioGroup
              @groupValue={{readonly @controller.grouping}}
              @onChange={{fn (mut @controller.grouping)}}
              as |group|
            >
              <div class='flex'>
                <group.radio @value='rides'>
                  rides
                </group.radio>
              </div>
              <div class='flex'>
                <group.radio @value='passengers'>
                  passengers
                </group.radio>
              </div>
            </PaperRadioGroup>
          </div>
        </card.content>
      </PaperCard>

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

      <div>
        <CopyButton
          @text={{@controller.clipboardText}}
          title={{@controller.copyButtonTitle}}
        >
          {{paperIcon 'content copy'}}
          Copy for report
        </CopyButton>
      </div>
    </PaperContent>
  </template>,
);

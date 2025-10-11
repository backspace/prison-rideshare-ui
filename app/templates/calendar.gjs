import RouteTemplate from 'ember-route-template';
import PowerCalendar from 'ember-power-calendar/components/power-calendar';
import perform from 'ember-concurrency/helpers/perform';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';
import { action } from '@ember/object';
import Component from '@glimmer/component';
import eq from 'ember-truth-helpers/helpers/eq';
import gt from 'ember-truth-helpers/helpers/gt';
import CalendarDay from 'prison-rideshare-ui/components/calendar-day';
import {
  HdsButton,
  HdsCardContainer,
  HdsFormRadioField,
  HdsFormRadioGroup,
  HdsFormTextInputField,
  HdsFormTextareaField,
  HdsFormToggleField,
  HdsIcon,
  HdsTooltipButton,
} from '@hashicorp/design-system-components/components';

import About from 'prison-rideshare-ui/components/calendar/about';
import EditPerson from 'prison-rideshare-ui/components/calendar/edit-person';

class CalendarComponent extends Component {
  @action toggleShowPerson() {
    this.args.controller.set('showPerson', !this.args.controller.showPerson);
  }

  @action submitPersonForm(event) {
    event.preventDefault();
    this.args.controller.savePerson.perform();
  }

  <template>
    <HdsCardContainer class='person-card' data-test-person-card>
      <div>
        <header>
          <div class='person-session' data-test-person-session>
            Logged in as
            {{@controller.person.email}}
          </div>
          {{#if @controller.showPerson}}
            <div class='person-actions'>
              <HdsButton
                @text='Cancel'
                @color='secondary'
                @size='small'
                data-test-person-cancel
                {{on 'click' @controller.cancel}}
                disabled={{@controller.savePerson.isRunning}}
              />
              <HdsButton
                @text={{if @controller.savePerson.isRunning 'Saving…' 'Save'}}
                @color={{if
                  @controller.person.hasDirtyAttributes
                  'primary'
                  'secondary'
                }}
                @size='small'
                data-test-person-save
                {{on 'click' (perform @controller.savePerson)}}
                disabled={{@controller.savePerson.isRunning}}
              />
            </div>
          {{else}}
            <HdsButton
              @text='Edit communication details'
              @color='primary'
              @size='small'
              class='toggle'
              data-test-person-toggle
              {{on 'click' this.toggleShowPerson}}
            />
          {{/if}}
        </header>

        {{#if @controller.showPerson}}
          <EditPerson
            @person={{@controller.person}}
            @submitPersonForm={{this.submitPersonForm}}
          />
        {{/if}}
      </div>
    </HdsCardContainer>

    <About
      @webcalUrl={{@controller.webcalSubscriptionUrl}}
      @httpUrl={{@controller.httpSubscriptionUrl}}
    />

    <PowerCalendar
      @center={{@controller.monthMoment}}
      @daysComponent='calendar-days'
      as |calendar|
    >
      <calendar.Nav />

      <calendar.Days @showDaysAround={{false}} as |day|>
        <CalendarDay
          @day={{day}}
          @slots={{@controller.slots}}
          @person={{@controller.person}}
        />
      </calendar.Days>
    </PowerCalendar>
  </template>
}

export default RouteTemplate(CalendarComponent);

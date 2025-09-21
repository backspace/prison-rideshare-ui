import RouteTemplate from 'ember-route-template'
import PowerCalendar from "ember-power-calendar/components/power-calendar";
import PaperCard from "ember-paper/_app_/components/paper-card.js";
import PaperButton from "ember-paper/components/paper-button";
import perform from "ember-concurrency/helpers/perform";
import not from "ember-truth-helpers/helpers/not";
import PaperForm from "ember-paper/_app_/components/paper-form.js";
import PaperRadioGroup from "ember-paper/components/paper-radio-group";
import PaperSwitch from "ember-paper/_app_/components/paper-switch.js";
import PaperTooltip from "ember-paper/components/paper-tooltip";
import CalendarDay from "prison-rideshare-ui/components/calendar-day";
export default RouteTemplate(<template>{{!-- template-lint-disable no-action --}}
<PowerCalendar @center={{@controller.monthMoment}} @daysComponent="calendar-days" as |calendar|>
  <PaperCard @class="person-card" as |card|>
    <card.content>
      <header>
        <div class="person-session">
          Logged in as {{@controller.person.email}}
        </div>
        {{#if @controller.showPerson}}
          <div>
            <PaperButton @class="cancel" @onClick="cancel" @disabled={{@controller.savePerson.isRunning}}>
              Cancel
            </PaperButton>
            <PaperButton @class="submit" @primary={{@controller.person.hasDirtyAttributes}} @raised={{@controller.person.hasDirtyAttributes}} @onClick={{perform @controller.savePerson}} @disabled={{@controller.savePerson.isRunning}}>
              {{if @controller.savePerson.isRunning "…" "Save"}}
            </PaperButton>
          </div>
        {{else}}
          <PaperButton @class="toggle" @label="Edit communication details" @onClick={{action (mut @controller.showPerson) (not @controller.showPerson)}} />
        {{/if}}
      </header>
      {{#if @controller.showPerson}}
        <PaperForm @onSubmit={{@controller.save}} as |form|>
          <PaperRadioGroup @groupValue={{readonly @controller.person.medium}} @onChange={{action (mut @controller.person.medium)}} as |group|>
            <div class="layout-row">
              <div class="layout-column flex-50">
                <form.input @class="name" @label="Name" @autofocus={{true}} @value={{@controller.person.name}} @onChange={{action (mut @controller.person.name)}} @errors={{@controller.person.validationErrors.name}} @isTouched={{readonly @controller.person.validationErrors.name.length}} />
              </div>
              <div class="layout-column flex-50">
                <PaperSwitch @value={{@controller.person.active}} @onChange={{action (mut @controller.person.active) (not @controller.person.active)}}>
                  Available for rides
                </PaperSwitch>
              </div>
            </div>
            <div class="layout-row">
              <div class="layout-column flex-50">
                <div class="layout-row text-radio mobile">
                  <form.input @type="mobile" @label="Mobile" @value={{@controller.person.mobile}} @onChange={{action (mut @controller.person.mobile)}} @errors={{@controller.person.validationErrors.mobile}} @isTouched={{readonly @controller.person.validationErrors.mobile.length}} />
                  <group.radio @value="mobile">
                    preferred
                  </group.radio>
                </div>
                <div class="layout-row text-radio landline">
                  <form.input @type="mobile" @label="Landline" @value={{@controller.person.landline}} @onChange={{action (mut @controller.person.landline)}} @errors={{@controller.person.validationErrors.landline}} @isTouched={{readonly @controller.person.validationErrors.landline.length}} />
                  <group.radio @value="landline">
                    preferred
                  </group.radio>
                </div>
              </div>
              <div class="layout-column email flex-50">
                <div class="layout-row text-radio">
                  <PaperTooltip>
                    Email us if you need to change this
                  </PaperTooltip>
                  <form.input @type="email" @label="Email" @disabled={{true}} @value={{@controller.person.email}} @onChange={{action (mut @controller.person.email)}} @errors={{@controller.person.validationErrors.email}} @isTouched={{readonly @controller.person.validationErrors.email.length}} />
                  <group.radio @value="email">
                    preferred
                  </group.radio>
                </div>
              </div>
            </div>
            <div class="layout-row">
              <div class="layout-column flex-100">
                <form.input @class="address" @textarea={{true}} @label="Mailing address" @value={{@controller.person.address}} @onChange={{action (mut @controller.person.address)}}>
                  <div class="hint">
                    To send you our quarterly newsletter and very occasionally, invitations or other such communications
                  </div>
                </form.input>
              </div>
            </div>
            <div class="layout-row">
              <div class="layout-column flex-100">
                <form.input @class="self-notes" @textarea={{true}} @label="Notes" @value={{@controller.person.selfNotes}} @onChange={{action (mut @controller.person.selfNotes)}}>
                  <div class="hint">
                    Vehicle capacity, institutions you don’t want to drive to, etc
                  </div>
                </form.input>
              </div>
            </div>
          </PaperRadioGroup>
        </PaperForm>
      {{/if}}
    </card.content>
  </PaperCard>

  <PaperCard as |card|>
    <card.content>
      <p>
        Let us know in advance when you can take people to visit their loved ones. Click a time slot below to commit. If you can’t commit anymore, click the slot again.
      </p>
      <p>
        Use the button above to access a form to change your communication preferences.
      </p>

      <p class="subscription">
        You can subscribe to a live-updating calendar that shows what times you’ve committed to as well as rides assigned to you. On Apple platforms, tap
        <a href={{@controller.webcalSubscriptionUrl}}>
          here
        </a>
        to subscribe; on other platforms, you’ll have to copy
        <a href={{@controller.httpSubscriptionUrl}}>
          this URL
        </a>
        into a calendar subscription field. Please be careful with these links, as they show contact information for riders. If they’re ever exposed, let us know and we can change the secret token.
      </p>
    </card.content>
  </PaperCard>

  <calendar.Nav />

  <calendar.Days @showDaysAround={{false}} as |day|>
    <CalendarDay @day={{day}} @slots={{@controller.slots}} @person={{@controller.person}} />
  </calendar.Days>
</PowerCalendar></template>)
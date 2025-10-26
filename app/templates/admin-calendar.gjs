import RouteTemplate from 'ember-route-template';
import ToolbarHeader from 'prison-rideshare-ui/components/toolbar-header';
import PowerCalendar from 'ember-power-calendar/components/power-calendar';
import { LinkTo } from '@ember/routing';
import momentFormat from 'ember-moment/helpers/moment-format';
import pluralize from 'ember-inflector/lib/helpers/pluralize';
import CalendarDay from 'prison-rideshare-ui/components/calendar-day';
import gt from 'ember-truth-helpers/helpers/gt';
import eq from 'ember-truth-helpers/helpers/eq';
import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';
import {
  HdsButton,
  HdsCardContainer,
  HdsFormTextInputField,
  HdsIcon,
  HdsTag,
} from '@hashicorp/design-system-components/components';
import Alert from 'prison-rideshare-ui/components/alert';

class AdminCalendarComponent extends Component {
  @tracked openCommitmentId = null;
  @tracked assignmentSearchTerm = '';
  @tracked emailSearchTerm = '';

  @action setViewingSlot(slot) {
    this.args.controller.set('viewingSlot', slot);
    this.openCommitmentId = null;
    this.assignmentSearchTerm = '';
  }

  @action changeMonth(value) {
    this.args.controller.set('month', value.date);
  }

  get uncommittedPeople() {
    return this.args.controller.uncommittedPeople ?? [];
  }

  get filteredUncommittedPeople() {
    const query = this.assignmentSearchTerm?.trim().toLowerCase();

    if (!query) {
      return this.uncommittedPeople;
    }

    return this.uncommittedPeople.filter((person) => {
      return (person.name ?? '').toLowerCase().includes(query);
    });
  }

  get shouldShowAssignmentOptions() {
    return Boolean(this.assignmentSearchTerm?.trim().length);
  }

  get remainingEmailPeople() {
    return this.args.controller.remainingPeople ?? [];
  }

  get filteredEmailOptions() {
    const query = this.emailSearchTerm?.trim().toLowerCase();

    if (!query) {
      return this.remainingEmailPeople;
    }

    return this.remainingEmailPeople.filter((person) => {
      return (person.name ?? '').toLowerCase().includes(query);
    });
  }

  get shouldShowEmailOptions() {
    return Boolean(this.emailSearchTerm?.trim().length);
  }

  get emailButtonText() {
    const month = this.args.controller?.monthString ?? '';
    return `Email ${month} calendar link`;
  }

  @action updateAssignmentSearch(event) {
    this.assignmentSearchTerm = event.target.value;
  }

  @action selectAssignmentPerson(person) {
    this.args.controller.createCommitment(person);
    this.assignmentSearchTerm = '';
  }

  @action toggleCommitmentDetails(commitment) {
    if (this.openCommitmentId === commitment.id) {
      this.openCommitmentId = null;
    } else {
      this.openCommitmentId = commitment.id;
    }
  }

  @action removeCommitment(commitment) {
    this.args.controller.deleteCommitment(commitment);
  }

  @action updateEmailSearch(event) {
    this.emailSearchTerm = event.target.value;
  }

  @action selectEmailPerson(person) {
    this.args.controller.addPerson(person);
    this.emailSearchTerm = '';
  }

  @action removeEmailPerson(person) {
    this.args.controller.removePerson(person);
  }

  <template>
    <ToolbarHeader @title={{@controller.title}} />

    {{#if @controller.errorMessage}}
      <Alert @message={{@controller.errorMessage}} />
    {{/if}}

    <div class='admin-calendar'>
      <PowerCalendar
        @center={{@controller.monthMoment}}
        @daysComponent='calendar-days'
        @onCenterChange={{this.changeMonth}}
        as |calendar|
      >
        <nav class='ember-power-calendar-nav'>
          <LinkTo
            @route='admin-calendar'
            @model={{@controller.previousMonth}}
            class='ember-power-calendar-nav-control previous-month'
          >
            ‹
          </LinkTo>
          <div class='ember-power-calendar-nav-title'>
            {{momentFormat calendar.center 'MMMM YYYY'}}:
            {{pluralize @controller.commitmentCount 'commitment'}}
          </div>
          <LinkTo
            @route='admin-calendar'
            @model={{@controller.nextMonth}}
            class='ember-power-calendar-nav-control next-month'
          >
            ›
          </LinkTo>
        </nav>

        <calendar.Days @showDaysAround={{false}} as |day|>
          <CalendarDay
            @day={{day}}
            @slots={{@controller.slots}}
            @count={{true}}
            @setViewingSlot={{this.setViewingSlot}}
            @setError={{this.setError}}
          />
        </calendar.Days>
      </PowerCalendar>

      <section>
        {{#if @controller.viewingSlot}}
          <HdsCardContainer class='viewing-slot'>
            <h3 class='hours'>
              {{momentFormat
                @controller.viewingSlot.start
                'dddd, MMMM D, h:mma'
              }}–{{momentFormat @controller.viewingSlot.end 'h:mma'}}
            </h3>

            <div class='commitments' data-test-commitments>
              {{#if @controller.viewingSlot.commitments.length}}
                <ul>
                  {{#each @controller.viewingSlot.commitments as |commitment|}}
                    <li class='commitment' data-test-commitment>
                      <button
                        type='button'
                        data-test-commitment-reveal
                        {{on
                          'click'
                          (fn this.toggleCommitmentDetails commitment)
                        }}
                      >
                        {{commitment.person.name}}
                      </button>
                      <HdsButton
                        @text='Remove'
                        @size='small'
                        @color='secondary'
                        data-test-commitment-remove
                        {{on 'click' (fn this.removeCommitment commitment)}}
                      />

                      {{#if (eq this.openCommitmentId commitment.id)}}
                        <ul data-test-commitment-contact>
                          {{#if commitment.person.email}}
                            <li data-test-commitment-email>
                              <HdsIcon @name='mail' @size='16' />
                              <span>{{commitment.person.email}}</span>
                            </li>
                          {{/if}}
                          {{#if commitment.person.mobile}}
                            <li>
                              <HdsIcon @name='smartphone' @size='16' />
                              <span>{{commitment.person.mobile}}</span>
                            </li>
                          {{/if}}
                          {{#if commitment.person.landline}}
                            <li>
                              <HdsIcon @name='phone' @size='16' />
                              <span>{{commitment.person.landline}}</span>
                            </li>
                          {{/if}}
                          {{#if commitment.person.selfNotes}}
                            <li>
                              <HdsIcon @name='file-text' @size='16' />
                              <span>{{commitment.person.selfNotes}}</span>
                            </li>
                          {{/if}}
                        </ul>
                      {{/if}}
                    </li>
                  {{/each}}
                </ul>
              {{else}}
                <p data-test-commitments-empty>
                  No commitments yet.
                </p>
              {{/if}}
            </div>

            <div data-test-commitment-search>
              <HdsFormTextInputField
                @value={{this.assignmentSearchTerm}}
                data-test-commitment-search-input
                {{on 'input' this.updateAssignmentSearch}}
                as |Field|
              >
                <Field.Label>Commit someone to this slot</Field.Label>
              </HdsFormTextInputField>

              {{#if this.shouldShowAssignmentOptions}}
                <ul data-test-commitment-options>
                  {{#each this.filteredUncommittedPeople as |person|}}
                    <li>
                      <button
                        type='button'
                        data-test-commitment-option
                        {{on 'click' (fn this.selectAssignmentPerson person)}}
                      >
                        {{person.name}}
                      </button>
                    </li>
                  {{/each}}
                  {{#if (eq this.filteredUncommittedPeople.length 0)}}
                    <li data-test-commitment-option-empty>
                      No matching people
                    </li>
                  {{/if}}
                </ul>
              {{/if}}
            </div>
          </HdsCardContainer>
        {{/if}}

        <HdsCardContainer class='email-card'>
          <h2>Temporary email interface</h2>

          <HdsButton
            @text='Add all active people'
            @color='secondary'
            @size='small'
            data-test-email-add-all
            {{on 'click' @controller.addAllActive}}
          />

          <div data-test-email-recipients>
            {{#each @controller.people as |person|}}
              <HdsTag
                @text={{person.name}}
                @onDismiss={{fn this.removeEmailPerson person}}
                data-test-email-person
              />
            {{/each}}
          </div>

          <HdsFormTextInputField
            @value={{this.emailSearchTerm}}
            data-test-email-search-input
            {{on 'input' this.updateEmailSearch}}
            as |Field|
          >
            <Field.Label>Add a person to email</Field.Label>
          </HdsFormTextInputField>

          {{#if this.shouldShowEmailOptions}}
            <ul data-test-email-options>
              {{#each this.filteredEmailOptions as |person|}}
                <li>
                  <button
                    type='button'
                    data-test-email-option
                    {{on 'click' (fn this.selectEmailPerson person)}}
                  >
                    {{person.name}}
                  </button>
                </li>
              {{/each}}
              {{#if (eq this.filteredEmailOptions.length 0)}}
                <li data-test-email-option-empty>
                  No matching people
                </li>
              {{/if}}
            </ul>
          {{/if}}

          <HdsButton
            @text={{this.emailButtonText}}
            @color={{if (gt @controller.people.length 0) 'primary' 'secondary'}}
            data-test-email-send
            {{on 'click' @controller.email}}
          />

          <HdsButton
            @text='View calendar links'
            @color='secondary'
            data-test-email-view-links
            {{on 'click' @controller.fetchLinks}}
          />

          {{#if @controller.links}}
            <ul data-test-email-links>
              {{#each @controller.links as |emailAndLink|}}
                <li>
                  <span>{{emailAndLink.email}}:</span>
                  <a href={{emailAndLink.link}} data-test-email-link>
                    link
                  </a>
                </li>
              {{/each}}
            </ul>
          {{/if}}

          {{#if @controller.linksError}}
            <p>
              There was an error loading calendar links:
              {{@controller.linksError}}
            </p>
          {{/if}}
        </HdsCardContainer>
      </section>
    </div>
  </template>
}

export default RouteTemplate(AdminCalendarComponent);

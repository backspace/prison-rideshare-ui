import RouteTemplate from 'ember-route-template'
import ToolbarHeader from "prison-rideshare-ui/components/toolbar-header";
import PowerCalendar from "ember-power-calendar/components/power-calendar";
import { LinkTo } from "@ember/routing";
import momentFormat from "ember-moment/helpers/moment-format";
import pluralize from "ember-inflector/lib/helpers/pluralize";
import CalendarDay from "prison-rideshare-ui/components/calendar-day";
import PaperChips from "ember-paper/components/paper-chips/component";
import PersonBadge from "prison-rideshare-ui/components/person-badge";
import PaperButton from "ember-paper/components/paper-button";
import gt from "ember-truth-helpers/helpers/gt";
import { action } from "@ember/object";
import Component from '@glimmer/component';

class AdminCalendarComponent extends Component {
  @action setViewingSlot(slot) {
    this.args.controller.set('viewingSlot', slot);
  }

  @action changeMonth(value) {
    //  @onCenterChange={{action (mut @controller.month) value="date"}}
    this.args.controller.set('month', value.date);
  }
<template>{{!-- template-lint-disable no-action --}}
<ToolbarHeader @title={{@controller.title}} />

<div class="admin-calendar">
  <PowerCalendar @center={{@controller.monthMoment}} @daysComponent="calendar-days" @onCenterChange={{this.changeMonth}} as |calendar|>
    <nav class="ember-power-calendar-nav">
      <LinkTo @route="admin-calendar" @model={{@controller.previousMonth}} class="ember-power-calendar-nav-control previous-month">
        ‹
      </LinkTo>
      <div class="ember-power-calendar-nav-title">
        {{momentFormat calendar.center "MMMM YYYY"}}: {{pluralize @controller.commitmentCount "commitment"}}
      </div>
      <LinkTo @route="admin-calendar" @model={{@controller.nextMonth}} class="ember-power-calendar-nav-control next-month">
        ›
      </LinkTo>
    </nav>

    <calendar.Days @showDaysAround={{false}} as |day|>
      <CalendarDay @day={{day}} @slots={{@controller.slots}} @count={{true}} @setViewingSlot={{this.setViewingSlot}} />
    </calendar.Days>
  </PowerCalendar>

  <section>
    {{#if @controller.viewingSlot}}
      <div class="viewing-slot">
        <h3 class="hours">
          {{momentFormat @controller.viewingSlot.start "dddd, MMMM D, h:mma"}}–{{momentFormat @controller.viewingSlot.end "h:mma"}}
        </h3>
        <PaperChips @removeItem={{@controller.deleteCommitment}} @addItem={{@controller.createCommitment}} @placeholder="Commit someone to this slot" @content={{@controller.viewingSlot.commitments}} @options={{@controller.uncommittedPeople}} @class="commitments" @searchField="name" as |person_or_commitment|>
          {{#if person_or_commitment.name}}
            <PersonBadge @person={{person_or_commitment}} />
          {{else}}
            <PersonBadge @person={{person_or_commitment.person}} />
          {{/if}}
        </PaperChips>
      </div>
    {{/if}}
    <h2>
      Temporary email interface
    </h2>
    <PaperButton @label="Add all active people" @raised={{true}} @onClick={{@controller.addAllActive}} />
    <PaperChips @removeItem={{@controller.removePerson}} @addItem={{@controller.addPerson}} @placeholder="Add a person to email" @content={{@controller.people}} @options={{@controller.remainingPeople}} @searchField="name" as |person|>
      {{person.name}}
    </PaperChips>
    <PaperButton @primary={{gt @controller.people.length 0}} @raised={{gt @controller.people.length 0}} @onClick={{@controller.email}}>
      Email {{@controller.monthString}} calendar link
    </PaperButton>
    <PaperButton @onClick={{@controller.fetchLinks}}>
      View calendar links
    </PaperButton>
    {{#if @controller.links}}
      <ul>
        {{#each @controller.links as |emailAndLink|}}
          <li>
            {{emailAndLink.email}}:
            <a href={{emailAndLink.link}}>
              link
            </a>
          </li>
        {{/each}}
      </ul>
    {{/if}}
    {{#if @controller.linksError}}
      There was an error loading calendar links: {{@controller.linksError}}
    {{/if}}
  </section>
</div></template>
}

export default RouteTemplate(AdminCalendarComponent);

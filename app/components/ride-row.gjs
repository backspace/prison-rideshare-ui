/* eslint-disable ember/no-classic-components, ember/no-get */
import classic from 'ember-classic-decorator';
import { tagName } from '@ember-decorators/component';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import reasonToIcon from 'prison-rideshare-ui/utils/reason-to-icon';
import fetch from 'fetch';
import ScrollTo from "prison-rideshare-ui/components/scroll-to";
import paperIcon from "ember-paper/components/paper-icon";
import LinkedContact from "prison-rideshare-ui/components/linked-contact";
import PaperButton from "ember-paper/components/paper-button";
import RidePerson from "prison-rideshare-ui/components/ride-person";
import or from "ember-truth-helpers/helpers/or";
import not from "ember-truth-helpers/helpers/not";
import eq from "ember-truth-helpers/helpers/eq";
import and from "ember-truth-helpers/helpers/and";
import ReimbursementUnit from "prison-rideshare-ui/components/reimbursement-unit";

const mediumIcon = {
  txt: 'textsms',
  email: 'email',
  phone: 'phone',
};

@classic
@tagName('')
export default class RideRow extends Component {<template>{{!-- template-lint-disable no-action --}}
<@body.row class={{this.classAttribute}} as |row|>
  {{#if this.showCreation}}
    <row.cell class="creation">
      {{this.creation}}
    </row.cell>
  {{/if}}
  <row.cell class="date-cell" @onClick={{this.toggleCreation}}>
    {{#if this.ride.isDivider}}
      <ScrollTo />
    {{/if}}
    <span class="date">
      {{this.ride.rideTimes}}
    </span>
    {{#if this.showCreation}}
      {{paperIcon "alarm off" size=14}}
    {{else}}
      {{paperIcon "add alarm" size=14}}
    {{/if}}
  </row.cell>
  <row.cell class="institution">
    {{this.ride.institution.name}}
  </row.cell>
  <row.cell class="name-and-contact">
    <span class="name">
      {{this.ride.namePlusPassengers}}
    </span>
    {{#if this.ride.firstTime}}
      {{paperIcon "announcement" size=10 title="first time rider"}}
    {{/if}}
    <div class="medium-and-contact">
      {{#if this.mediumIcon}}
        {{paperIcon this.mediumIcon size=10 title=this.mediumIconTitle}}
      {{/if}}
      <span class="contact">
        <LinkedContact @contact={{this.ride.contact}} />
      </span>
    </div>
  </row.cell>
  <row.cell class="address">
    {{this.ride.address}}
  </row.cell>
  <row.cell class="driver-and-car-owner">
    {{#if this.combined}}
      {{#unless this.rideToCombine}}
        <PaperButton class="combine" @iconButton={{true}} @aria-label="Uncombine this ride" @title="Uncombine this ride" @onClick={{this.uncombineRide this.ride}}>
          {{paperIcon "call split"}}
        </PaperButton>
      {{/unless}}
    {{else}}
      <span class="driver">
        <RidePerson @ride={{this.ride}} @property="driver" @onChange={{this.setDriver}} />
      </span>
      <span class="car-owner">
        <RidePerson @ride={{this.ride}} @property="carOwner" @onChange={{this.setCarOwner}} />
      </span>
      {{#if this.ride.overridable}}
        {{paperIcon "directions_bus" title="driver can override car expenses (van-driving, probably)"}}
      {{/if}}
      {{#if (or (not this.ride.children) this.rideToCombine)}}
        <PaperButton class="combine" @iconButton={{true}} @raised={{eq this.ride.id this.rideToCombine.id}} @aria-label={{this.combineButtonLabel}} @title={{this.combineButtonLabel}} @onClick={{this.combineRide this.ride}}>
          {{paperIcon "merge type"}}
        </PaperButton>
      {{/if}}
    {{/if}}
  </row.cell>
  <row.cell>
    <span class="cancellation">
      <PaperButton @iconButton={{true}} @aria-label={{this.cancellationButtonLabel}} @title={{this.cancellationButtonLabel}} @onClick={{this.editCancellation this.ride}}>
        {{#if this.ride.enabled}}
          {{paperIcon "highlight off"}}
        {{else}}
          {{paperIcon this.cancellationIcon}}
        {{/if}}
      </PaperButton>
    </span>
    <PaperButton @iconButton={{true}} @aria-label="Edit ride" @title="Edit ride" class="edit" @onClick={{this.editRide this.ride}}>
      {{paperIcon "mode edit"}}
    </PaperButton>
  </row.cell>
</@body.row>

{{#each this.commitments as |commitment|}}
  <@body.row class="overlap highlighted" as |row|>
    {{row.cell}}
    <row.cell @colspan={{3}}>
      {{paperIcon "date range"}}
      <span class="text">
        {{commitment.person.name}} committed to slot {{commitment.timespan}}
      </span>
    </row.cell>
    <row.cell @colspan={{3}}>
      <PaperButton class="assign" @onClick={{this.assignFromCommitment commitment}}>
        Assign
      </PaperButton>
      <PaperButton class="ignore" @onClick={{this.ignoreCommitment commitment}}>
        Ignore
      </PaperButton>
    </row.cell>
  </@body.row>
{{/each}}

{{#if this.ride.requiresConfirmation}}
  <@body.row class="confirmation-notification highlighted" as |row|>
    {{row.cell}}
    <row.cell @colspan={{3}}>
      {{#if this.mediumIcon}}
        {{paperIcon this.mediumIcon title=this.mediumIconTitle}}
      {{/if}}
      <span>
        Contact visitor to confirm receipt of ride request
      </span>
    </row.cell>
    <row.cell @colspan={{3}}>
      <PaperButton class="mark-confirmed" @onClick={{this.markConfirmed}}>
        Mark as contacted
      </PaperButton>
    </row.cell>
  </@body.row>
{{/if}}

{{#if this.ride.requestNotes}}
  <@body.row class="notes" as |row|>
    {{row.cell}}
    <row.cell class="notes" @colspan={{6}}>
      {{this.ride.requestNotes}}
    </row.cell>
  </@body.row>
{{/if}}
{{#if this.ride.complete}}
  <@body.row class="report" as |row|>
    {{row.cell}}
    <row.cell @colspan={{6}}>
      {{paperIcon "map"}}
      <span class="distance">
        {{this.ride.distance}}
      </span>
      {{#if this.ride.carExpenses}}
        {{paperIcon "local gas station"}}
        <span class="car-expenses">
          {{this.ride.carExpensesDollars}}
        </span>
        {{#if (and this.ride.rate (not this.ride.overridable))}}
          (<span class="rate">{{this.ride.rate}}<ReimbursementUnit /></span>)
        {{/if}}
      {{/if}}
      {{#if this.ride.foodExpenses}}
        {{paperIcon "local cafe"}}
        <span class="food-expenses">
          {{this.ride.foodExpensesDollars}}
        </span>
      {{/if}}
      {{#if this.ride.reportNotes}}
        {{paperIcon "note"}}
        <span class="notes">
          {{this.ride.reportNotes}}
        </span>
      {{/if}}
      {{#if this.clearing}}
        Clear this report?
        <PaperButton class="clear-confirm" @warn={{true}} @aria-label="Clear report" @title="Clear report" @onClick={{this.clearReport}}>
          Yes
        </PaperButton>
        <PaperButton class="clear-cancel" @aria-label="Don’t clear report" @title="Don’t clear report" @onClick={{action (mut this.clearing) false}}>
          No
        </PaperButton>
      {{else}}
        <PaperButton @iconButton={{true}} @aria-label="Clear report" @title="Clear report" @onClick={{this.proposeClear}}>
          {{paperIcon "clear"}}
        </PaperButton>
      {{/if}}
    </row.cell>
  </@body.row>
{{/if}}</template>
  @computed(
    'uncombinable',
    'ride.{isCombined,isDivider,enabled,requiresConfirmation}',
    'commitments.[]'
  )
  get classAttribute() {
    return `ride ${this.get('ride.enabled') ? 'enabled' : ''} ${
      this.uncombinable ? 'uncombinable' : ''
    } ${this.get('ride.isCombined') ? 'combined' : ''} ${
      this.get('ride.isDivider') ? 'divider' : ''
    } ${
      this.get('ride.requiresConfirmation') || this.get('commitments.length')
        ? 'highlighted'
        : ''
    }`;
  }

  @service
  moment;

  @service
  overlaps;

  @service
  session;

  @service
  store;

  // TODO this is unfortunate but without it ignoring doesn’t make the overlap immediately disappear
  @computed('overlaps.overlaps.data.@each.id', 'ride')
  get commitments() {
    return this.overlaps.commitmentsForRide(this.ride);
  }

  clearing = false;

  @computed('ride.insertedAt')
  get creation() {
    const insertedAt = this.get('ride.insertedAt');

    return this.moment.moment(insertedAt).format('ddd MMM D YYYY h:mma');
  }

  @computed('ride.cancellationReason')
  get cancellationIcon() {
    const reason = this.get('ride.cancellationReason');
    const icon = reasonToIcon[reason];

    return icon || 'help';
  }

  @computed('ride.{enabled,cancellationReason}')
  get cancellationButtonLabel() {
    if (this.get('ride.enabled')) {
      return 'Cancel ride';
    } else {
      return `Edit cancellation: ${this.get('ride.cancellationReason')}`;
    }
  }

  @computed('ride.id', 'rideToCombine.id')
  get combineButtonLabel() {
    if (this.get('ride.id') == this.get('rideToCombine.id')) {
      return 'Cancel combining';
    } else {
      return 'Combine with another ride';
    }
  }

  @computed('rideToCombine.{id,start}', 'ride.start')
  get uncombinable() {
    const sixHours = 1000 * 60 * 60 * 6;
    const rideToCombineStart = this.get('rideToCombine.start');

    if (!rideToCombineStart) {
      return false;
    } else {
      return (
        Math.abs(
          new Date(rideToCombineStart).getTime() -
            new Date(this.get('ride.start')).getTime()
        ) > sixHours
      );
    }
  }

  @computed('ride.medium')
  get mediumIcon() {
    return mediumIcon[this.get('ride.medium')];
  }

  @computed('ride.medium')
  get mediumIconTitle() {
    return `ride was requested via ${this.get('ride.medium')}`;
  }

  @action
  setDriver(driver) {
    const ride = this.ride;

    ride.set('driver', driver);

    return ride
      .get('carOwner')
      .then((carOwner) => {
        if (!carOwner) {
          ride.set('carOwner', driver);
        }

        return ride.save();
      })
      .then(() => this.overlaps.fetch());
  }

  @action
  setCarOwner(carOwner) {
    const ride = this.ride;

    ride.set('carOwner', carOwner);
    return ride.save();
  }

  @action
  assignFromCommitment(commitmentJson) {
    let person = this.store.peekRecord(
      'person',
      commitmentJson.relationships.person.data.id
    );

    this.send('setDriver', person);
  }

  @action
  ignoreCommitment(commitmentJson) {
    let ride = this.ride;
    let url = `${ride.store
      .adapterFor('ride')
      .buildURL('ride', ride.id)}/ignore/${commitmentJson.id}`;
    let token = this.get('session.data.authenticated.access_token');

    fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(() => {
      return this.overlaps.fetch();
    });
  }

  @action
  markConfirmed() {
    let ride = this.ride;
    ride.set('requestConfirmed', true);
    return ride.save();
  }

  @action
  match(option, searchTerm) {
    const name = option.name;
    const result = (name || '')
      .toLowerCase()
      .startsWith(searchTerm.toLowerCase());

    return result ? 1 : -1;
  }

  @action
  toggleCreation() {
    this.toggleProperty('showCreation');
  }

  @action
  proposeClear() {
    this.set('clearing', true);
  }

  @action
  clearReport() {
    this.set('ride.donation', null);
    this.set('ride.distance', null);
    this.set('ride.reportNotes', null);
    this.set('ride.foodExpenses', 0);
    this.set('ride.carExpenses', 0);
    this.set('ride.complete', false);

    this.ride.save();
  }
}

/* eslint-disable ember/no-classic-components, ember/no-get */
import classic from 'ember-classic-decorator';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { tagName } from '@ember-decorators/component';
import reasonToIcon from 'prison-rideshare-ui/utils/reason-to-icon';
import fetch from 'fetch';
import ScrollTo from 'prison-rideshare-ui/components/scroll-to';
import LinkedContact from 'prison-rideshare-ui/components/linked-contact';
import RidePerson from 'prison-rideshare-ui/components/ride-person';
import ReimbursementUnit from 'prison-rideshare-ui/components/reimbursement-unit';
import {
  HdsButton,
  HdsIcon,
} from '@hashicorp/design-system-components/components';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';
import or from 'ember-truth-helpers/helpers/or';
import not from 'ember-truth-helpers/helpers/not';
import and from 'ember-truth-helpers/helpers/and';
import eq from 'ember-truth-helpers/helpers/eq';

@classic
@tagName('')
export default class RideRow extends Component {
  <template>
    <@table.Tr
      class={{this.rowClass}}
      data-test-ride-row
      data-ride-id={{this.ride.id}}
    >
      {{#if this.showCreation}}
        <@table.Td data-test-ride-creation>
          {{this.creation}}
        </@table.Td>
      {{/if}}
      <@table.Td
        class='date-cell'
        data-test-ride-date-cell
        {{on 'click' this.toggleCreation}}
      >
        {{#if this.ride.isDivider}}
          <ScrollTo />
        {{/if}}
        <span class='date' data-test-ride-date>
          {{this.ride.rideTimes}}
        </span>
      </@table.Td>
      <@table.Td class='institution' data-test-ride-institution>
        {{this.ride.institution.name}}
      </@table.Td>
      <@table.Td>
        <span class='name' data-test-ride-name>
          {{this.ride.namePlusPassengers}}
        </span>
        {{#if this.ride.firstTime}}
          <HdsIcon
            @name='alert-triangle'
            @size='16'
            data-test-ride-first-time
          />
        {{/if}}
        <div data-test-ride-medium data-medium={{this.ride.medium}}>
          {{#if this.mediumIcon}}
            <HdsIcon @name={{this.mediumIcon}} @size='16' @isInline={{true}} />
          {{/if}}
          <span data-test-ride-contact>
            <LinkedContact @contact={{this.ride.contact}} />
          </span>
        </div>
      </@table.Td>
      <@table.Td data-test-ride-address>
        {{this.ride.address}}
      </@table.Td>
      <@table.Td data-test-ride-assignments>
        {{#if @combined}}
          {{#unless this.rideToCombine}}
            <button
              type='button'
              data-test-combine-button
              title='Uncombine this ride'
              {{on 'click' (fn this.uncombineRide this.ride)}}
            >
              Uncombine
            </button>
          {{/unless}}
        {{else}}
          <span data-test-driver>
            <RidePerson
              @ride={{this.ride}}
              @property='driver'
              @onChange={{this.setDriver}}
            />
          </span>
          <span data-test-car-owner>
            <RidePerson
              @ride={{this.ride}}
              @property='carOwner'
              @onChange={{this.setCarOwner}}
            />
          </span>
          {{#if this.ride.overridable}}
            <span data-test-overridable-indicator>
              <HdsIcon @name='truck' @size='16' />
            </span>
          {{/if}}
          {{#if (or (not this.ride.children) this.rideToCombine)}}
            <button
              type='button'
              data-test-combine-button
              data-active={{if
                (and this.rideToCombine (eq this.ride.id this.rideToCombine.id))
                'true'
                'false'
              }}
              title={{this.combineButtonLabel}}
              {{on 'click' (fn this.combineRide this.ride)}}
            >
              {{if
                (and this.rideToCombine (eq this.ride.id this.rideToCombine.id))
                'Cancel combining'
                'Combine'
              }}
            </button>
          {{/if}}
        {{/if}}
      </@table.Td>
      <@table.Td>
        <HdsButton
          data-test-cancellation-button
          data-cancellation-state={{this.cancellationState}}
          @text={{this.cancellationButtonLabel}}
          @color='tertiary'
          @isIconOnly={{true}}
          @icon={{if this.ride.enabled 'x-circle' this.cancellationIcon}}
          {{on 'click' (fn this.editCancellation this.ride)}}
        />
        <HdsButton
          data-test-edit-ride
          @text='Edit ride'
          @color='secondary'
          @isIconOnly={{true}}
          @icon='edit'
          {{on 'click' (fn this.editRide this.ride)}}
        />
      </@table.Td>
    </@table.Tr>

    {{#each this.commitments as |commitment|}}
      <@table.Tr
        class='overlap highlighted no-top-border'
        data-test-overlap-row
      >
        {{#if this.showCreation}}
          <@table.Td />
        {{/if}}
        <@table.Td colspan='3'>
          <HdsIcon @name='calendar' @size='16' />
          <span data-test-overlap-text>
            {{commitment.person.name}}
            committed to slot
            {{commitment.timespan}}
          </span>
        </@table.Td>
        <@table.Td colspan='3'>
          <button
            type='button'
            data-test-overlap-assign
            {{on 'click' (fn this.assignFromCommitment commitment)}}
          >
            Assign
          </button>
          <button
            type='button'
            data-test-overlap-ignore
            {{on 'click' (fn this.ignoreCommitment commitment)}}
          >
            Ignore
          </button>
        </@table.Td>
      </@table.Tr>
    {{/each}}

    {{#if this.ride.requiresConfirmation}}
      <@table.Tr class='highlighted no-top-border' data-test-confirmation-row>
        {{#if this.showCreation}}
          <@table.Td />
        {{/if}}
        <@table.Td colspan='3'>
          {{#if this.mediumIcon}}
            <HdsIcon @name={{this.mediumIcon}} @size='16' />
          {{/if}}
          <span class='text' data-test-confirmation-text>
            Contact visitor to confirm receipt of ride request
          </span>
        </@table.Td>
        <@table.Td colspan='3'>
          <button
            type='button'
            data-test-confirmation-mark
            {{on 'click' this.markConfirmed}}
          >
            Mark as contacted
          </button>
        </@table.Td>
      </@table.Tr>
    {{/if}}

    {{#if this.ride.requestNotes}}
      <@table.Tr class='notes no-top-border' data-test-notes-row>
        {{#if this.showCreation}}
          <@table.Td />
        {{/if}}
        <@table.Td data-test-notes colspan='6'>
          {{this.ride.requestNotes}}
        </@table.Td>
      </@table.Tr>
    {{/if}}

    {{#if this.ride.complete}}
      <@table.Tr class='report no-top-border' data-test-report-row>
        {{#if this.showCreation}}
          <@table.Td />
        {{/if}}
        <@table.Td colspan='6'>
          <span class='distance' data-test-report-distance>
            {{this.ride.distance}}
          </span>
          {{#if this.ride.carExpenses}}
            <span data-test-report-car-expenses>
              {{this.ride.carExpensesDollars}}
            </span>
            {{#if (and this.ride.rate (not this.ride.overridable))}}
              (<span data-test-report-rate>{{this.ride.rate}}<ReimbursementUnit
                /></span>)
            {{/if}}
          {{/if}}
          {{#if this.ride.foodExpenses}}
            <span data-test-report-food>
              {{this.ride.foodExpensesDollars}}
            </span>
          {{/if}}
          {{#if this.ride.reportNotes}}
            <span class='notes' data-test-report-notes>
              {{this.ride.reportNotes}}
            </span>
          {{/if}}
          {{#if this.clearing}}
            Clear this report?
            <button
              type='button'
              data-test-report-clear-confirm
              {{on 'click' this.clearReport}}
            >
              Yes
            </button>
            <button
              type='button'
              data-test-report-clear-cancel
              {{on 'click' this.unproposeClear}}
            >
              No
            </button>
          {{else}}
            <button
              type='button'
              data-test-report-clear
              {{on 'click' this.proposeClear}}
            >
              Clear report
            </button>
          {{/if}}
        </@table.Td>
      </@table.Tr>
    {{/if}}
  </template>

  @service
  moment;

  @service
  overlaps;

  @service
  session;

  @service
  store;

  clearing = false;

  @computed(
    'uncombinable',
    'ride.{isCombined,isDivider,enabled,requiresConfirmation}',
    'commitments.length',
  )
  get rowClass() {
    return `ride ${this.ride.enabled ? 'enabled' : ''} ${
      this.uncombinable ? 'uncombinable' : ''
    } ${this.ride.isCombined ? 'combined' : ''} ${
      this.ride.isDivider ? 'divider' : ''
    } ${
      this.ride.requiresConfirmation || this.commitments.length
        ? 'highlighted'
        : ''
    }`;
  }

  @computed('overlaps.overlaps.data.@each.id', 'ride')
  get commitments() {
    return this.overlaps.commitmentsForRide(this.ride);
  }

  @computed('ride.insertedAt')
  get creation() {
    const insertedAt = this.ride.insertedAt;
    return this.moment.moment(insertedAt).format('ddd MMM D YYYY h:mma');
  }

  @computed('ride.{enabled,cancellationReason}')
  get cancellationIcon() {
    if (this.ride.enabled) {
      return 'slash';
    }

    const reason = this.ride.cancellationReason;
    return reasonToIcon[reason] ?? 'alert-circle';
  }

  @computed('ride.{enabled,cancellationReason}')
  get cancellationButtonLabel() {
    if (this.get('ride.enabled')) {
      return 'Cancel ride';
    } else {
      return `Edit cancellation: ${this.get('ride.cancellationReason')}`;
    }
  }

  @computed('ride.{enabled,cancellationReason}')
  get cancellationState() {
    return this.ride.enabled ? 'not-cancelled' : this.ride.cancellationReason;
  }

  @computed('ride.id', 'rideToCombine.id')
  get combineButtonLabel() {
    if (this.ride.id === this.rideToCombine?.id) {
      return 'Cancel combining';
    }

    return 'Combine with another ride';
  }

  @computed('rideToCombine.{id,start}', 'ride.start')
  get uncombinable() {
    const sixHours = 1000 * 60 * 60 * 6;
    const rideToCombineStart = this.rideToCombine?.start;

    if (!rideToCombineStart) {
      return false;
    }

    return (
      Math.abs(
        new Date(rideToCombineStart).getTime() -
          new Date(this.ride.start).getTime(),
      ) > sixHours
    );
  }

  @computed('ride.medium')
  get mediumIcon() {
    switch (this.ride.medium) {
      case 'txt':
        return 'message-circle';
      case 'email':
        return 'mail';
      case 'phone':
        return 'phone';
      default:
        return null;
    }
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
      commitmentJson.relationships.person.data.id,
    );

    this.setDriver(person);
  }

  @action
  ignoreCommitment(commitmentJson) {
    let ride = this.ride;
    let url = `${ride.store
      .adapterFor('ride')
      .buildURL('ride', ride.id)}/ignore/${commitmentJson.id}`;
    let token = this.session.data?.authenticated?.access_token;

    fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(() => this.overlaps.fetch());
  }

  @action
  markConfirmed() {
    let ride = this.ride;
    ride.set('requestConfirmed', true);
    return ride.save();
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
  unproposeClear() {
    this.set('clearing', false);
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

/* eslint-disable ember/no-classic-components, ember/no-get, ember/require-tagless-components */
import classic from 'ember-classic-decorator';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';
import Component from '@ember/component';
import moment from 'moment';
import formatTimespan from 'prison-rideshare-ui/utils/format-timespan';
import parseTimespan from 'prison-rideshare-ui/utils/parse-timespan';
import deduplicateVisitorSuggestions from 'prison-rideshare-ui/utils/deduplicate-visitor-suggestions';
import PaperDialog from "ember-paper/components/paper-dialog";
import PaperDialogContent from "ember-paper/components/paper-dialog-content";
import PaperCard from "ember-paper/_app_/components/paper-card.js";
import PaperForm from "ember-paper/_app_/components/paper-form.js";
import paperIcon from "ember-paper/_app_/components/paper-icon.js";
import PaperButton from "ember-paper/components/paper-button";
import { on } from "@ember/modifier";
import { fn } from "@ember/helper";
import PaperSelect from "ember-paper/components/paper-select/component";
import PaperCheckbox from "ember-paper/_app_/components/paper-checkbox.js";
import PaperRadioGroup from "ember-paper/components/paper-radio-group";
import PaperAutocompleteHighlight from "ember-paper/components/paper-autocomplete/highlight/component";
import PaperDialogActions from "ember-paper/components/paper-dialog-actions";

const DATETIME_LOCAL_FORMAT = 'YYYY-MM-DDTHH:mm';

@classic
export default class RideForm extends Component {<template>{{!-- template-lint-disable no-action --}}
<PaperDialog @onClose={{this.cancel}} @fullscreen={{true}}>
  <PaperDialogContent>
    {{#if this.editingWarning}}
      <PaperCard @class="editing-warning" as |card|>
        <card.content>
          {{this.editingWarning}}
        </card.content>
      </PaperCard>
    {{/if}}
    <h2 class="md-title">
      {{if this.ride.isNew "Record" "Edit"}} a ride request
    </h2>
    <PaperForm @onSubmit={{this.save}} as |form|>
      <div class="layout-column">
        <form.input @class="timespan" @label="Timespan" @autofocus={{true}} @textarea={{true}} @value={{this.ride.timespan}} @onChange={{action "timespanUpdated"}}>
          <div class="hint">
            “friday from 2 to 4” or “tomorrow 11am to noon”
          </div>
        </form.input>
      </div>
      <div class="timespan-result">
        {{#if this.timespanWarning}}
          <div class="layout-row">
            <PaperCard @class="flex-100 timespan-warning" as |card|>
              <card.content>
                {{paperIcon "warning"}} This request is in the past
              </card.content>
            </PaperCard>
          </div>
        {{/if}}
        <div class="layout-row layout-xs-column layout-align-center-center">
          <form.input @label="Ride times" @value={{this.rideTimes}} @disabled={{true}} @onChange={{null}} />
          {{#unless this.overrideTimespan}}
            <PaperButton data-test-timespan-override-button {{on "click" (fn (mut this.overrideTimespan) true)}}>
              Manual times
            </PaperButton>
          {{/unless}}
        </div>
      </div>
      {{#if this.overrideTimespan}}
        <div class="layout-row">
          <form.input @type="datetime-local" @label="Start time" @value={{this.startTimeString}} @onChange={{action "updateStartTime"}} @errors={{this.ride.validationErrors.start}} @isTouched={{readonly this.ride.validationErrors.start.length}} data-test-timespan-start />
        </div>
        <div class="layout-row">
          <form.input @type="datetime-local" @label="End time" @value={{this.endTimeString}} @onChange={{action "updateEndTime"}} @errors={{this.ride.validationErrors.end}} @isTouched={{readonly this.ride.validationErrors.end.length}} data-test-timespan-end />
        </div>
      {{/if}}
      <div class="layout-row layout-xs-column layout-align-center-center">
        <div class="flex">
          <PaperSelect @class="institution" @placeholder="Institution" @selected={{this.ride.institution}} @searchField="name" @options={{this.institutions}} @onChange={{action (mut this.ride.institution)}} @errors={{this.ride.validationErrors.institution}} @isTouched={{readonly this.ride.validationErrors.institution.length}} as |institution|>
            {{institution.name}}
          </PaperSelect>
        </div>
        <div class="flex">
          <PaperCheckbox @class="overridable" @value={{this.ride.overridable}} @onChange={{action (mut this.ride.overridable)}}>
            Sunshine House van?
          </PaperCheckbox>
        </div>
      </div>
      <div class="layout-row layout-xs-column medium-row">
        <PaperRadioGroup @groupValue={{readonly this.ride.medium}} @onChange={{action (mut this.ride.medium)}} as |group|>
          <div class="flex" title="ride was requested via txt">
            <group.radio @value="txt" @class="txt">
              {{paperIcon "textsms"}}
            </group.radio>
          </div>
          <div class="flex" title="ride was requested via email">
            <group.radio @value="email" @class="email">
              {{paperIcon "email"}}
            </group.radio>
          </div>
          <div class="flex" title="ride was requested via phone">
            <group.radio @value="phone" @class="phone">
              {{paperIcon "phone"}}
            </group.radio>
          </div>
        </PaperRadioGroup>
      </div>
      <div class="layout-row layout-xs-column medium-row">
        <div class="flex">
          <PaperCheckbox @class="request-confirmed" @value={{this.ride.requestConfirmed}} @onChange={{action (mut this.ride.requestConfirmed)}}>
            Confirmed receipt of request with visitor?
          </PaperCheckbox>
        </div>
      </div>

      <h3 class="md-title">
        Visitor details
      </h3>

      <div class="layout-row layout-xs-column">
        <div class="flex">
          <form.autocomplete @label="Name" @selected={{this.ride}} @onSelectionChange={{action "autocompleteSelectionChanged"}} @onSearchTextChange={{action (mut this.ride.name)}} @search={{action "searchRides"}} @searchField="name" @labelPath="name" @searchText={{readonly this.ride.name}} @errors={{this.ride.validationErrors.name}} @isTouched={{readonly this.ride.validationErrors.name.length}} as |ride autocomplete|>
            <div class="visitor-autocomplete-option">
              <span class="name">
                <PaperAutocompleteHighlight @label={{ride.name}} @searchText={{autocomplete.searchText}} @flags="i" />
              </span>
              <address>
                {{ride.address}}
              </address>
              <span class="contact">
                {{ride.contact}}
              </span>
            </div>
          </form.autocomplete>
        </div>
      </div>
      <div class="layout-row layout-xs-column">
        <div class="flex">
          <form.input @class="address" @label="Address" @value={{this.ride.address}} @onChange={{action (mut this.ride.address)}} @errors={{this.ride.validationErrors.address}} @isTouched={{readonly this.ride.validationErrors.address.length}} />
        </div>
      </div>
      <div class="layout-row layout-xs-column">
        <div class="flex">
          <form.input @class="contact" @label="Contact" @value={{this.ride.contact}} @onChange={{action (mut this.ride.contact)}} @errors={{this.ride.validationErrors.contact}} @isTouched={{readonly this.ride.validationErrors.contact.length}} />
        </div>
      </div>
      <div class="layout-row layout-xs-column layout-align-center-center">
        <div class="flex">
          <form.input @class="passengers" @label="Passengers" @value={{this.ride.passengers}} @onChange={{action (mut this.ride.passengers)}} @errors={{this.ride.validationErrors.passengers}} @isTouched={{readonly this.ride.validationErrors.passengers.length}} />
        </div>
        <div class="flex">
          <PaperCheckbox @class="first-time" @value={{this.ride.firstTime}} @onChange={{action (mut this.ride.firstTime)}}>
            First time?
          </PaperCheckbox>
        </div>
      </div>
      {{#if this.ride.firstTime}}
        <PaperCard @class="first-time-points" as |card|>
          <card.content>
            Some notes for first-time riders:
            <ul>
              <li>
                the drivers and coordinators are all volunteering
              </li>
              <li>
                we don’t screen drivers, but please let us know if you have any concerns
              </li>
              <li>
                it’s more likely you’ll get a ride if you request early; you can even do it before you have a visit scheduled
              </li>
              <li>
                open meetings happen monthly; share date and location of the next
              </li>
              <li>
                do you need help figuring out how to sign up for a visit?
                <ul>
                  <li>
                    if you are a coordinator and are unsure how to help, contact your buddy or
                    <a href="mailto:barnone.wpg@gmail.com">
                      barnone.wpg@gmail.com
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </card.content>
        </PaperCard>
      {{/if}}

      <div class="layout layout-sm-column">
        <form.input @class="request-notes" @textarea={{true}} @label="Notes" @value={{this.ride.requestNotes}} @onChange={{action (mut this.ride.requestNotes)}} />
      </div>
    </PaperForm>
  </PaperDialogContent>

  <PaperDialogActions @class="layout-row">
    <PaperButton @class="cancel" @onClick={{this.cancel}}>
      Cancel
    </PaperButton>
    <PaperButton @class="submit" @primary={{true}} @onClick={{this.save}}>
      Save
    </PaperButton>
  </PaperDialogActions>
</PaperDialog></template>
  @service('institutions')
  institutionsService;

  @alias('institutionsService.all')
  institutions;

  @service
  moment;

  @service('store')
  store;

  overrideTimespan = false;

  @computed('ride.{cancellationReason,complete}')
  get editingWarning() {
    const reason = this.get('ride.cancellationReason');
    const complete = this.get('ride.complete');

    if (reason) {
      return 'You are editing a cancelled ride!';
    } else if (complete) {
      return 'You are editing a ride that has already had its report completed!';
    } else {
      return false;
    }
  }

  @computed('ride.{start,end}')
  get timespanWarning() {
    const start = this.get('ride.start');
    const end = this.get('ride.end');

    return start && end && start < new Date();
  }

  @computed('ride.{start,end}')
  get rideTimes() {
    if (this.get('ride.start') && this.get('ride.end')) {
      const start = this.get('ride.start');
      const end = this.get('ride.end');

      return formatTimespan(this.moment, start, end);
    } else {
      return undefined;
    }
  }

  @computed('ride.start')
  get startTimeString() {
    return moment(this.get('ride.start')).format(DATETIME_LOCAL_FORMAT);
  }

  @computed('ride.end')
  get endTimeString() {
    return moment(this.get('ride.end')).format(DATETIME_LOCAL_FORMAT);
  }

  @action
  timespanUpdated(value) {
    this.set('ride.timespan', value);
    const parsed = parseTimespan(value);

    if (parsed) {
      if (parsed.start) {
        this.set('ride.start', parsed.start.date());
      }

      if (parsed.end) {
        this.set('ride.end', parsed.end.date());
      }
    }
  }

  @action
  searchRides(name) {
    return this.store.query('ride', { 'filter[name]': name }).then((rides) => {
      return deduplicateVisitorSuggestions(rides);
    });
  }

  @action
  autocompleteSelectionChanged(ride) {
    if (ride) {
      this.set('ride.name', ride.get('name'));
      this.set('ride.address', ride.get('address'));
      this.set('ride.contact', ride.get('contact'));
    }
  }

  @action
  updateStartTime(value) {
    this.set(
      'ride.start',
      new Date(moment(value, DATETIME_LOCAL_FORMAT).valueOf())
    );
  }

  @action
  updateEndTime(value) {
    this.set(
      'ride.end',
      new Date(moment(value, DATETIME_LOCAL_FORMAT).valueOf())
    );
  }
}

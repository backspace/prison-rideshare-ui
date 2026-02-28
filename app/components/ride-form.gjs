/* eslint-disable ember/classic-decorator-no-classic-methods, ember/no-classic-components, ember/no-computed-properties-in-native-classes, ember/no-get, ember/require-tagless-components */
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';
import Component from '@ember/component';
import moment from 'moment-timezone';
import formatTimespan from 'prison-rideshare-ui/utils/format-timespan';
import parseTimespan from 'prison-rideshare-ui/utils/parse-timespan';
import deduplicateVisitorSuggestions from 'prison-rideshare-ui/utils/deduplicate-visitor-suggestions';
import {
  HdsAlert,
  HdsModal,
  HdsButton,
  HdsButtonSet,
  HdsForm,
  HdsFormSectionMultiFieldGroup,
  HdsFormSuperSelectSingleField,
  HdsFormTextInputField,
  HdsFormTextareaField,
  HdsFormCheckboxField,
  HdsFormRadioGroup,
  HdsFormField,
  HdsIcon,
  HdsSegmentedGroup,
} from '@hashicorp/design-system-components/components';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';
import eq from 'ember-truth-helpers/helpers/eq';
import gt from 'ember-truth-helpers/helpers/gt';
import { tracked } from '@glimmer/tracking';
import { scheduleTask } from 'ember-lifeline';
import Alert from 'prison-rideshare-ui/components/alert';

const DATETIME_LOCAL_FORMAT = 'YYYY-MM-DDTHH:mm';

const SelectedRideVisitor = <template>{{@option.name}}</template>;

export default class RideForm extends Component {
  lastSearchTerm = null;
  lastSearchPromise = null;
  overrideTimespan = false;

  @tracked pendingUnmatchedVisitorName = '';
  @tracked visitorSelection = null;

  @computed('ride.name', 'visitorSelection')
  get nameOrVisitorSelection() {
    if (this.visitorSelection) {
      return this.visitorSelection;
    }

    const name = this.get('ride.name');

    return name ? { name } : null;
  }

  <template>
    <HdsModal
      data-test-ride-form
      @onClose={{this.handleCancel}}
      {{on 'cancel' this.handleCancel}}
      as |M|
    >
      <M.Header>
        {{if this.ride.isNew 'Record' 'Edit'}}
        a ride request
      </M.Header>

      <M.Body>
        {{#if this.editingWarning}}
          <HdsAlert
            @type='inline'
            @color='critical'
            data-test-editing-warning
            as |A|
          >
            <A.Description>{{this.editingWarning}}</A.Description>
          </HdsAlert>
        {{/if}}

        {{#if this.errorMessage}}
          <Alert @message={{this.errorMessage}} />
        {{/if}}

        <HdsForm id='ride-form' {{on 'submit' this.handleSubmit}} as |Form|>
          <Form.Section>
            <HdsFormTextareaField
              rows='1'
              @value={{this.ride.timespan}}
              @isInvalid={{this.timespanFieldIsInvalid}}
              @id='ride-form-timespan'
              {{on 'input' this.timespanUpdated}}
              data-test-timespan
              as |Field|
            >
              <Field.Label>Timespan</Field.Label>
              <Field.HelperText>
                <div>
                  “friday from 2 to 4” or “tomorrow 11am to noon”
                </div>
              </Field.HelperText>
              {{#if this.shouldShowTimespanValidationErrors}}
                {{#each this.timespanValidationErrors as |error|}}
                  <Field.Error data-test-timespan-error>
                    <span>{{error}}</span>
                  </Field.Error>
                {{/each}}
              {{/if}}
            </HdsFormTextareaField>
          </Form.Section>

          <HdsFormField @layout='vertical' data-test-timespan-result as |Field|>
            <Field.Label>Ride times</Field.Label>
            <Field.Control>
              <HdsSegmentedGroup class='timespan-result' as |SegmentedGroup|>
                <SegmentedGroup.TextInput
                  id={{Field.id}}
                  aria-describedby={{Field.ariaDescribedBy}}
                  @value={{this.rideTimes}}
                  @isInvalid={{this.timespanWarning}}
                  disabled={{true}}
                />
                <SegmentedGroup.Button
                  @text='Manual times'
                  @color='secondary'
                  disabled={{this.overrideTimespan}}
                  data-test-timespan-override-button
                  {{on 'click' (fn (mut this.overrideTimespan) true)}}
                />
              </HdsSegmentedGroup>
            </Field.Control>
            {{#if this.timespanWarningPast}}
              <Field.Error data-test-timespan-warning-past>
                This request is in the past
              </Field.Error>
            {{/if}}
            {{#if this.timespanWarningLong}}
              <Field.Error data-test-timespan-warning-duration>
                This request is longer than 24 hours
              </Field.Error>
            {{/if}}
          </HdsFormField>

          {{#if this.overrideTimespan}}
            <Form.Section>
              <HdsFormSectionMultiFieldGroup>
                <HdsFormTextInputField
                  @value={{this.startTimeString}}
                  @type='datetime-local'
                  @isInvalid={{gt this.ride.validationErrors.start.length 0}}
                  data-test-timespan-start
                  {{on 'change' this.updateStartTime}}
                  as |Field|
                >
                  <Field.Label>Start time</Field.Label>
                  {{#if (gt this.ride.validationErrors.start.length 0)}}
                    <Field.Error>
                      {{#each this.ride.validationErrors.start as |error|}}
                        <span>{{error}}</span>
                      {{/each}}
                    </Field.Error>
                  {{/if}}
                </HdsFormTextInputField>
                <HdsFormTextInputField
                  @value={{this.endTimeString}}
                  @type='datetime-local'
                  @isInvalid={{gt this.ride.validationErrors.end.length 0}}
                  data-test-timespan-end
                  {{on 'change' this.updateEndTime}}
                  as |Field|
                >
                  <Field.Label>End time</Field.Label>
                  {{#if (gt this.ride.validationErrors.end.length 0)}}
                    <Field.Error data-test-timespan-end-error>
                      {{#each this.ride.validationErrors.end as |error|}}
                        <span>{{error}}</span>
                      {{/each}}
                    </Field.Error>
                  {{/if}}
                </HdsFormTextInputField>
              </HdsFormSectionMultiFieldGroup>
            </Form.Section>
          {{/if}}

          <HdsFormSuperSelectSingleField
            data-test-institution-select
            @options={{this.institutions}}
            @selected={{this.ride.institution}}
            @searchField='name'
            @onChange={{fn this.updateRidePropertyWithValue 'institution'}}
            as |F|
          >
            <F.Label>Institution</F.Label>
            <F.Options>
              {{#let F.options as |institution|}}
                {{institution.name}}
              {{/let}}
            </F.Options>
            {{#if (gt this.ride.validationErrors.institution.length 0)}}
              <F.Error data-test-institution-error>
                {{#each this.ride.validationErrors.institution as |error|}}
                  <span>{{error}}</span>
                {{/each}}
              </F.Error>
            {{/if}}
          </HdsFormSuperSelectSingleField>
          <div>
            <HdsFormCheckboxField
              checked={{if this.ride.overridable true undefined}}
              data-test-overridable
              {{on 'change' (fn this.toggleCheckbox 'overridable')}}
              as |Field|
            >
              <Field.Label>Sunshine House van?</Field.Label>
            </HdsFormCheckboxField>
          </div>

          <div>
            <HdsFormRadioGroup @layout='horizontal' as |Group|>
              <Group.RadioField
                @value='txt'
                title='ride was requested via txt'
                checked={{eq this.ride.medium 'txt'}}
                data-test-medium-txt
                {{on
                  'change'
                  (fn this.updateRidePropertyWithValue 'medium' 'txt')
                }}
                as |Field|
              >
                <Field.Label>
                  <HdsIcon
                    @name='message-circle'
                    @size='16'
                    @isInline={{true}}
                  />
                  txt
                </Field.Label>
              </Group.RadioField>
              <Group.RadioField
                @value='email'
                title='ride was requested via email'
                checked={{eq this.ride.medium 'email'}}
                data-test-medium-email
                {{on
                  'change'
                  (fn this.updateRidePropertyWithValue 'medium' 'email')
                }}
                as |Field|
              >
                <Field.Label>
                  <HdsIcon @name='mail' @size='16' @isInline={{true}} />
                  email
                </Field.Label>
              </Group.RadioField>
              <Group.RadioField
                @value='phone'
                title='ride was requested via phone'
                checked={{eq this.ride.medium 'phone'}}
                data-test-medium-phone
                {{on
                  'change'
                  (fn this.updateRidePropertyWithValue 'medium' 'phone')
                }}
                as |Field|
              >
                <Field.Label>
                  <HdsIcon @name='phone' @size='16' @isInline={{true}} />
                  voice
                </Field.Label>
              </Group.RadioField>
            </HdsFormRadioGroup>
          </div>

          <div>
            <div>
              <HdsFormCheckboxField
                checked={{if this.ride.requestConfirmed true undefined}}
                data-test-request-confirmed
                {{on 'change' (fn this.toggleCheckbox 'requestConfirmed')}}
                as |Field|
              >
                <Field.Label>Confirmed receipt of request with visitor?</Field.Label>
              </HdsFormCheckboxField>
            </div>
          </div>

          <Form.Section>
            <Form.SectionHeader>
              <Form.SectionHeaderTitle @tag='h3'>
                Visitor details
              </Form.SectionHeaderTitle>
            </Form.SectionHeader>

            <div>
              <HdsFormSuperSelectSingleField
                data-test-visitor-select
                @searchEnabled={{true}}
                @search={{this.searchRides}}
                @selected={{this.nameOrVisitorSelection}}
                @selectedItemComponent={{SelectedRideVisitor}}
                @noMatchesMessage='No previous visitors found'
                @onChange={{this.visitorSelected}}
                @onBlur={{this.maybeStoreUnmatchedVisitorName}}
                @onClose={{this.maybeStoreUnmatchedVisitorName}}
                @onInput={{this.storeVisitorName}}
                as |F|
              >
                <F.Label>Name</F.Label>
                <F.Options>
                  {{#let F.options as |option|}}
                    {{#if option.customVisitor}}
                      <div data-test-new-visitor-option>
                        <span class='name'>Use “{{option.name}}” as visitor name</span>
                      </div>
                    {{else}}
                      <div data-test-visitor-suggestion>
                        <span class='name'>{{option.name}}</span>
                        <address>{{option.address}}</address>
                        <span class='contact'>{{option.contact}}</span>
                      </div>
                    {{/if}}
                  {{/let}}
                </F.Options>
                {{#if (gt this.ride.validationErrors.name.length 0)}}
                  <F.Error data-test-name-error as |E|>
                    {{#each this.ride.validationErrors.name as |error|}}
                      <E.Message><span>{{error}}</span></E.Message>
                    {{/each}}
                  </F.Error>
                {{/if}}
              </HdsFormSuperSelectSingleField>
            </div>

            <div>
              <div>
                <HdsFormTextInputField
                  data-test-address
                  @value={{this.ride.address}}
                  @isInvalid={{gt this.ride.validationErrors.address.length 0}}
                  {{on 'input' (fn this.updateRideProperty 'address')}}
                  as |Field|
                >
                  <Field.Label>Address</Field.Label>
                  {{#if (gt this.ride.validationErrors.address.length 0)}}
                    <Field.Error>
                      {{#each this.ride.validationErrors.address as |error|}}
                        <span>{{error}}</span>
                      {{/each}}
                    </Field.Error>
                  {{/if}}
                </HdsFormTextInputField>
              </div>
            </div>

            <div>
              <div>
                <HdsFormTextInputField
                  data-test-contact
                  @value={{this.ride.contact}}
                  @isInvalid={{gt this.ride.validationErrors.contact.length 0}}
                  {{on 'input' (fn this.updateRideProperty 'contact')}}
                  as |Field|
                >
                  <Field.Label>Contact</Field.Label>
                  {{#if (gt this.ride.validationErrors.contact.length 0)}}
                    <Field.Error>
                      {{#each this.ride.validationErrors.contact as |error|}}
                        <span>{{error}}</span>
                      {{/each}}
                    </Field.Error>
                  {{/if}}
                </HdsFormTextInputField>
              </div>
            </div>

            <div>
              <div>
                <HdsFormTextInputField
                  data-test-passengers
                  @value={{this.ride.passengers}}
                  @isInvalid={{gt
                    this.ride.validationErrors.passengers.length
                    0
                  }}
                  {{on 'input' (fn this.updateRideProperty 'passengers')}}
                  as |Field|
                >
                  <Field.Label>Passengers</Field.Label>
                  {{#if (gt this.ride.validationErrors.passengers.length 0)}}
                    <Field.Error>
                      {{#each this.ride.validationErrors.passengers as |error|}}
                        <span>{{error}}</span>
                      {{/each}}
                    </Field.Error>
                  {{/if}}
                </HdsFormTextInputField>
              </div>
              <div>
                <HdsFormCheckboxField
                  data-test-first-time
                  checked={{if this.ride.firstTime true undefined}}
                  {{on 'change' (fn this.toggleCheckbox 'firstTime')}}
                  as |Field|
                >
                  <Field.Label>First time?</Field.Label>
                </HdsFormCheckboxField>
              </div>
            </div>

            {{#if this.ride.firstTime}}
              <div data-test-first-time-points>
                Tell them:
                <ul>
                  <li>drivers and coordinators are all volunteers</li>
                  <li>
                    we don’t screen drivers, but let us know if you have any
                    concerns
                  </li>
                  <li>
                    requesting early increases your chances of getting a ride;
                    can request before you have a visit scheduled
                  </li>
                  <li>
                    meetings happen monthly; share date and location of the next
                    one
                  </li>
                  <li>do you need help signing up for a visit?</li>
                  <li>
                    can we add you to the email list for monthly rideshare info
                    and events; not required to access rides
                  </li>
                </ul>
                Coordinators:
                <ul>
                  <li>
                    unsure how to help with visit signup? Contact your buddy or
                    <a href='mailto:barnone.wpg@gmail.com'>
                      barnone.wpg@gmail.com
                    </a>
                  </li>
                  <li>
                    see log for notes on how to add an address to the email list
                  </li>
                </ul>
              </div>
            {{/if}}

            <HdsFormTextareaField
              data-test-request-notes
              @value={{this.ride.requestNotes}}
              @isInvalid={{false}}
              {{on 'input' (fn this.updateRideProperty 'requestNotes')}}
              as |Field|
            >
              <Field.Label>Notes</Field.Label>
            </HdsFormTextareaField>
          </Form.Section>
        </HdsForm>
      </M.Body>

      <M.Footer as |Footer|>
        <HdsButtonSet>
          <HdsButton
            type='submit'
            form='ride-form'
            @color='primary'
            @text='Save'
            data-test-ride-form-submit
          />
          <HdsButton
            type='button'
            @color='secondary'
            @text='Cancel'
            data-test-ride-form-cancel
            {{on 'click' Footer.close}}
          />
        </HdsButtonSet>
      </M.Footer>
    </HdsModal>
  </template>

  @service('institutions')
  institutionsService;

  @alias('institutionsService.all')
  institutions;

  @service
  moment;

  @service('store')
  store;

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
  get timespanWarningPast() {
    const start = this.get('ride.start');
    const end = this.get('ride.end');

    return start && end && start < new Date();
  }

  @computed('ride.{start,end}')
  get timespanWarningLong() {
    const start = this.get('ride.start');
    const end = this.get('ride.end');

    if (!start || !end) {
      return false;
    }

    const durationMs = end - start;
    const maxDurationMs = 24 * 60 * 60 * 1000;

    return durationMs > maxDurationMs;
  }

  @computed('timespanWarningPast', 'timespanWarningLong')
  get timespanWarning() {
    return this.timespanWarningPast || this.timespanWarningLong;
  }

  @computed('ride.validationErrors.{start.[],end.[]}')
  get timespanValidationErrors() {
    const validationErrors = this.get('ride.validationErrors') || {};
    const startErrors = validationErrors.start || [];
    const endErrors = validationErrors.end || [];

    return [...startErrors, ...endErrors];
  }

  @computed('overrideTimespan', 'timespanValidationErrors.length')
  get shouldShowTimespanValidationErrors() {
    return !this.overrideTimespan && this.timespanValidationErrors.length > 0;
  }

  @computed('timespanWarning', 'shouldShowTimespanValidationErrors')
  get timespanFieldIsInvalid() {
    return Boolean(
      this.timespanWarning || this.shouldShowTimespanValidationErrors,
    );
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
    const start = this.get('ride.start');
    if (!start) {
      return '';
    }

    return moment(start).format(DATETIME_LOCAL_FORMAT);
  }

  @computed('ride.end')
  get endTimeString() {
    const end = this.get('ride.end');
    if (!end) {
      return '';
    }

    return moment(end).format(DATETIME_LOCAL_FORMAT);
  }

  @action
  timespanUpdated(event) {
    const value = event?.target?.value ?? '';
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

  @action searchRides(term) {
    const trimmedTerm = term?.trim() ?? '';

    if (!trimmedTerm) {
      this.lastSearchTerm = null;
      this.lastSearchPromise = null;
      return [];
    }

    if (trimmedTerm === this.lastSearchTerm && this.lastSearchPromise) {
      return this.lastSearchPromise;
    }

    const promise = this.store
      .query('ride', { 'filter[name]': term })
      .then((rides) => {
        const suggestions = deduplicateVisitorSuggestions(rides);
        return this.buildVisitorOptions(trimmedTerm, suggestions);
      });

    this.lastSearchTerm = trimmedTerm;
    this.lastSearchPromise = promise;

    return promise;
  }

  @action
  visitorSelected(ride) {
    if (ride?.customVisitor) {
      this.visitorSelection = null;
      this.set('ride.name', ride.name);
      this.pendingUnmatchedVisitorName = '';
      return;
    }

    this.visitorSelection = ride;
    this.pendingUnmatchedVisitorName = '';

    if (ride) {
      this.set('ride.name', ride.get('name'));
      this.set('ride.address', ride.get('address'));
      this.set('ride.contact', ride.get('contact'));
    } else {
      this.set('ride.name', '');
      this.set('ride.address', '');
      this.set('ride.contact', '');
    }
  }

  @action storeVisitorName(enteredText) {
    this.pendingUnmatchedVisitorName = enteredText?.trim?.() ?? '';
  }

  @action maybeStoreUnmatchedVisitorName() {
    scheduleTask(this, 'actions', () => {
      if (this.visitorSelection) {
        this.pendingUnmatchedVisitorName = '';
        return;
      }

      let existingName = this.get('ride.name');

      if (
        this.pendingUnmatchedVisitorName &&
        existingName !== this.pendingUnmatchedVisitorName
      ) {
        this.set('ride.name', this.pendingUnmatchedVisitorName);
      }
      this.pendingUnmatchedVisitorName = '';
    });
  }

  buildVisitorOptions(term, suggestions) {
    const manualOption = this.createManualVisitorOption(term);
    if (manualOption) {
      return [...suggestions, manualOption];
    }
    return suggestions;
  }

  createManualVisitorOption(name) {
    const value = name?.trim?.() ?? '';
    if (!value) {
      return null;
    }
    return {
      id: `manual-visitor-${value.toLowerCase()}`,
      customVisitor: true,
      name: value,
    };
  }

  @action
  updateStartTime(event) {
    const value = event?.target?.value;
    if (!value) {
      return;
    }

    this.set(
      'ride.start',
      new Date(moment(value, DATETIME_LOCAL_FORMAT).valueOf()),
    );
  }

  @action
  updateEndTime(event) {
    const value = event?.target?.value;
    if (!value) {
      return;
    }

    this.set(
      'ride.end',
      new Date(moment(value, DATETIME_LOCAL_FORMAT).valueOf()),
    );
  }

  @action
  updateRideProperty(property, event) {
    this.set(`ride.${property}`, event.target.value);
  }

  @action
  updateRidePropertyWithValue(property, value) {
    this.set(`ride.${property}`, value);
  }

  @action
  toggleCheckbox(property, event) {
    const checked = event?.target?.checked ?? false;
    this.set(`ride.${property}`, checked);
  }

  @action
  handleSubmit(event) {
    event?.preventDefault?.();
    return this.save?.();
  }

  @action
  handleCancel(event) {
    event?.preventDefault?.();
    return this.cancel?.();
  }
}

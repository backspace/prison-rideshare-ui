/* eslint-disable ember/no-classic-components, ember/no-get, ember/require-tagless-components */
import classic from 'ember-classic-decorator';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';
import Component from '@ember/component';
import moment from 'moment-timezone';
import formatTimespan from 'prison-rideshare-ui/utils/format-timespan';
import parseTimespan from 'prison-rideshare-ui/utils/parse-timespan';
import deduplicateVisitorSuggestions from 'prison-rideshare-ui/utils/deduplicate-visitor-suggestions';
import {
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

const DATETIME_LOCAL_FORMAT = 'YYYY-MM-DDTHH:mm';

const SelectedRideVisitor = <template>{{@option.name}}</template>;

const NoMatchesComponent = <template>
  Press enter to save this name if no one matches
</template>;

@classic
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
      {{on 'cancel' this.handleDialogCancel}}
      as |M|
    >
      <M.Header>
        {{#if this.editingWarning}}
          <div data-test-editing-warning>
            <HdsIcon @name='alert-triangle' @size='16' />
            {{this.editingWarning}}
          </div>
        {{/if}}
        <h2>
          {{if this.ride.isNew 'Record' 'Edit'}}
          a ride request
        </h2>
      </M.Header>

      <M.Body>
        <HdsForm {{on 'submit' this.handleSubmit}} as |Form|>
          <Form.Section>
            <HdsFormTextareaField
              rows='1'
              @value={{this.ride.timespan}}
              @isInvalid={{this.timespanWarning}}
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
            </HdsFormTextareaField>
          </Form.Section>

          <HdsFormField @layout='vertical' data-test-timespan-result as |Field|>
            <Field.Label>Ride times</Field.Label>
            <Field.Control>
              <HdsSegmentedGroup as |SegmentedGroup|>
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
            {{#if this.timespanWarning}}
              <Field.Error data-test-timespan-warning>
                This request is in the past
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
                @showAfterOptions={{true}}
                @afterOptionsComponent={{NoMatchesComponent}}
                @onChange={{this.visitorSelected}}
                @onBlur={{this.maybeStoreUnmatchedVisitorName}}
                @onClose={{this.maybeStoreUnmatchedVisitorName}}
                @onInput={{this.storeVisitorName}}
                as |F|
              >
                <F.Label>Name</F.Label>
                <F.Options>
                  {{#let F.options as |ride|}}
                    <div>
                      <span class='name'>{{ride.name}}</span>
                      <address>{{ride.address}}</address>
                      <span class='contact'>{{ride.contact}}</span>
                    </div>
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
                Some notes for first-time riders:
                <ul>
                  <li>
                    the drivers and coordinators are all volunteering
                  </li>
                  <li>
                    we don’t screen drivers, but please let us know if you have
                    any concerns
                  </li>
                  <li>
                    it’s more likely you’ll get a ride if you request early; you
                    can even do it before you have a visit scheduled
                  </li>
                  <li>
                    open meetings happen monthly; share date and location of the
                    next
                  </li>
                  <li>
                    do you need help figuring out how to sign up for a visit?
                    <ul>
                      <li>
                        if you are a coordinator and are unsure how to help,
                        contact your buddy or
                        <a href='mailto:barnone.wpg@gmail.com'>
                          barnone.wpg@gmail.com
                        </a>
                      </li>
                    </ul>
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

      <M.Footer>
        <HdsButtonSet>
          <HdsButton
            @text='Save'
            @color='primary'
            data-test-ride-form-submit
            {{on 'click' this.handleSubmit}}
          />
          <HdsButton
            @text='Cancel'
            @color='secondary'
            data-test-ride-form-cancel
            {{on 'click' this.handleCancel}}
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

  get SelectedRideVisitor() {
    return SelectedRideVisitor;
  }

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
    if (!term) {
      this.lastSearchTerm = null;
      this.lastSearchPromise = null;
      return [];
    }

    if (term === this.lastSearchTerm && this.lastSearchPromise) {
      return this.lastSearchPromise;
    }

    const promise = this.store
      .query('ride', { 'filter[name]': term })
      .then((rides) => deduplicateVisitorSuggestions(rides));

    this.lastSearchTerm = term;
    this.lastSearchPromise = promise;

    return promise;
  }

  @action
  visitorSelected(ride) {
    console.log('visitorSelected', ride);
    this.visitorSelection = ride;
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
    this.pendingUnmatchedVisitorName = enteredText;
  }

  @action maybeStoreUnmatchedVisitorName() {
    scheduleTask(this, 'actions', () => {
      let existingName = this.get('ride.name');

      if (
        this.pendingUnmatchedVisitorName &&
        existingName !== this.pendingUnmatchedVisitorName
      ) {
        this.set('ride.name', this.pendingUnmatchedVisitorName);
      }
    });
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
  handleDialogCancel(event) {
    event?.preventDefault?.();
    this.handleCancel();
  }

  @action
  handleSubmit(event) {
    event?.preventDefault?.();
    this.save?.();
  }

  @action
  handleCancel(event) {
    event?.preventDefault?.();
    this.cancel?.();
  }
}

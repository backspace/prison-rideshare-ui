import Component from '@glimmer/component';
import {
  HdsFormRadioField,
  HdsFormTextInputField,
  HdsFormTextareaField,
  HdsFormToggleField,
} from '@hashicorp/design-system-components/components';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';
import eq from 'ember-truth-helpers/helpers/eq';
import gt from 'ember-truth-helpers/helpers/gt';
import { action } from '@ember/object';

export default class CalendarEditPersonComponent extends Component {
  @action updatePersonAttribute(attribute, valueOrEvent) {
    let value = valueOrEvent;

    if (
      valueOrEvent &&
      typeof valueOrEvent === 'object' &&
      'target' in valueOrEvent &&
      valueOrEvent.target
    ) {
      const { target } = valueOrEvent;

      if (target.type === 'checkbox') {
        value = target.checked;
      } else {
        value = target.value;
      }
    }

    this.args.person.set(attribute, value);
  }

  <template>
    <form
      class='person-form'
      data-test-person-form
      {{on 'submit' @submitPersonForm}}
    >
      <div class='layout-row'>
        <div data-test-person-name-field>
          {{#let @person.validationErrors.name as |nameErrors|}}
            <HdsFormTextInputField
              @value={{@person.name}}
              @isInvalid={{gt nameErrors.length 0}}
              data-test-person-name-input
              data-validation-state={{if
                (gt nameErrors.length 0)
                'invalid'
                'valid'
              }}
              autofocus={{true}}
              {{on 'input' (fn this.updatePersonAttribute 'name')}}
              as |Field|
            >
              <Field.Label>Name</Field.Label>
              {{#if (gt nameErrors.length 0)}}
                <Field.Error>
                  {{#each nameErrors as |error|}}
                    <span data-test-person-name-error>{{error}}</span>
                  {{/each}}
                </Field.Error>
              {{/if}}
            </HdsFormTextInputField>
          {{/let}}
        </div>
      </div>
      <div class='layout-row'>
        <div>
          <HdsFormToggleField
            checked={{@person.active}}
            data-test-person-active
            {{on 'change' (fn this.updatePersonAttribute 'active')}}
            as |Field|
          >
            <Field.Label>Available for rides</Field.Label>
          </HdsFormToggleField>
        </div>
      </div>
      <div class='layout-row'>
        <div>
          <div
            class='layout-row text-radio mobile'
            data-test-person-mobile-field
          >
            {{#let @person.validationErrors.mobile as |mobileErrors|}}
              <HdsFormTextInputField
                @value={{@person.mobile}}
                @isInvalid={{gt mobileErrors.length 0}}
                data-test-person-mobile-input
                data-validation-state={{if
                  (gt mobileErrors.length 0)
                  'invalid'
                  'valid'
                }}
                {{on 'input' (fn this.updatePersonAttribute 'mobile')}}
                as |Field|
              >
                <Field.Label>Mobile</Field.Label>
                {{#if (gt mobileErrors.length 0)}}
                  <Field.Error>
                    {{#each mobileErrors as |error|}}
                      <span data-test-person-mobile-error>{{error}}</span>
                    {{/each}}
                  </Field.Error>
                {{/if}}
              </HdsFormTextInputField>
            {{/let}}
            <HdsFormRadioField
              @value='mobile'
              name='preferred-medium'
              checked={{eq @person.medium 'mobile'}}
              data-test-person-medium-radio='mobile'
              {{on 'change' (fn this.updatePersonAttribute 'medium')}}
              as |Field|
            >
              <Field.Label>preferred</Field.Label>
            </HdsFormRadioField>
          </div>

          <div
            class='layout-row text-radio landline'
            data-test-person-landline-field
          >
            {{#let @person.validationErrors.landline as |landlineErrors|}}
              <HdsFormTextInputField
                @value={{@person.landline}}
                @isInvalid={{gt landlineErrors.length 0}}
                data-test-person-landline-input
                data-validation-state={{if
                  (gt landlineErrors.length 0)
                  'invalid'
                  'valid'
                }}
                {{on 'input' (fn this.updatePersonAttribute 'landline')}}
                as |Field|
              >
                <Field.Label>Landline</Field.Label>
                {{#if (gt landlineErrors.length 0)}}
                  <Field.Error>
                    {{#each landlineErrors as |error|}}
                      <span data-test-person-landline-error>{{error}}</span>
                    {{/each}}
                  </Field.Error>
                {{/if}}
              </HdsFormTextInputField>
            {{/let}}
            <HdsFormRadioField
              @value='landline'
              name='preferred-medium'
              checked={{eq @person.medium 'landline'}}
              data-test-person-medium-radio='landline'
              {{on 'change' (fn this.updatePersonAttribute 'medium')}}
              as |Field|
            >
              <Field.Label>preferred</Field.Label>
            </HdsFormRadioField>
          </div>
        </div>

        <div class='layout-column email flex-50'>
          <div class='layout-row text-radio' data-test-person-email-field>
            {{#let @person.validationErrors.email as |emailErrors|}}
              <HdsFormTextInputField
                @value={{@person.email}}
                @isInvalid={{gt emailErrors.length 0}}
                type='email'
                data-test-person-email-input
                data-validation-state={{if
                  (gt emailErrors.length 0)
                  'invalid'
                  'valid'
                }}
                disabled={{true}}
                {{on 'input' (fn this.updatePersonAttribute 'email')}}
                as |Field|
              >
                <Field.Label>Email</Field.Label>
                {{#if (gt emailErrors.length 0)}}
                  <Field.Error>
                    {{#each emailErrors as |error|}}
                      <span data-test-person-email-error>{{error}}</span>
                    {{/each}}
                  </Field.Error>
                {{/if}}
                <Field.HelperText>Email us if you need to change this</Field.HelperText>
              </HdsFormTextInputField>
            {{/let}}
            <HdsFormRadioField
              @value='email'
              name='preferred-medium'
              checked={{eq @person.medium 'email'}}
              data-test-person-medium-radio='email'
              {{on 'change' (fn this.updatePersonAttribute 'medium')}}
              as |Field|
            >
              <Field.Label>preferred</Field.Label>
            </HdsFormRadioField>
          </div>
        </div>
      </div>

      <div class='layout-row'>
        <div class='layout-column flex-100'>
          <HdsFormTextareaField
            @value={{@person.address}}
            data-test-person-address-field
            {{on 'input' (fn this.updatePersonAttribute 'address')}}
            as |Field|
          >
            <Field.Label class='address'>Mailing address</Field.Label>
            <Field.HelperText>
              <div class='hint'>
                To send you our quarterly newsletter and very occasionally,
                invitations or other such communications
              </div>
            </Field.HelperText>
          </HdsFormTextareaField>
        </div>
      </div>

      <div class='layout-row'>
        <div class='layout-column flex-100'>
          <HdsFormTextareaField
            @value={{@person.selfNotes}}
            data-test-person-self-notes-field
            {{on 'input' (fn this.updatePersonAttribute 'selfNotes')}}
            as |Field|
          >
            <Field.Label class='self-notes'>Notes</Field.Label>
            <Field.HelperText>
              <div class='hint'>
                Vehicle capacity, institutions you don’t want to drive to, etc
              </div>
            </Field.HelperText>
          </HdsFormTextareaField>
        </div>
      </div>
    </form>
  </template>
}

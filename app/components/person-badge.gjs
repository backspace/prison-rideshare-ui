/* eslint-disable ember/no-classic-classes, ember/no-classic-components, ember/require-tagless-components */
import classic from 'ember-classic-decorator';
import { action } from '@ember/object';
import { classNames } from '@ember-decorators/component';
import Component from '@ember/component';
import eq from 'ember-truth-helpers/helpers/eq';
import {
  HdsButton,
  HdsIcon,
} from '@hashicorp/design-system-components/components';
import { on } from '@ember/modifier';

@classic
@classNames('person-badge')
export default class PersonBadge extends Component {
  <template>
    {{! template-lint-disable no-invalid-interactive }}
    <div data-test-person-badge-toggle onclick={{this.toggleContact}}>
      {{#if (eq this.property 'driver')}}
        <HdsIcon @name='user' @size='14' @title='driver' @isInline={{true}} />
      {{else if (eq this.property 'carOwner')}}
        <HdsIcon
          @name='truck'
          @size='14'
          @title='car owner'
          @isInline={{true}}
        />
      {{/if}}
      <span data-test-person-badge-name>
        {{this.person.name}}
      </span>
      {{#if this.clear}}
        <HdsButton
          data-test-person-badge-clear
          {{on 'click' this.clear}}
          @isIconOnly={{true}}
          @isInline={{true}}
          @icon='x'
          @text='Remove'
          @size='small'
          @color='tertiary'
        />
      {{/if}}
    </div>
    {{#if this.showContact}}
      <div class='contact-container'>
        {{#if this.person.email}}
          <a href='mailto:{{this.person.email}}'>
            <HdsIcon
              @name='mail'
              @size='14'
              @title='email address'
              @isInline={{true}}
            />
            <span data-test-person-badge-email>
              {{this.person.email}}
            </span>
          </a>
        {{/if}}
        {{#if this.person.mobile}}
          <a href='tel:{{this.person.mobile}}'>
            <HdsIcon
              @name='smartphone'
              @size='14'
              @title='mobile phone number'
              @isInline={{true}}
            />
            <span data-test-person-badge-mobile>
              {{this.person.mobile}}
            </span>
          </a>
        {{/if}}
        {{#if this.person.landline}}
          <a href='tel:{{this.person.landline}}'>
            <HdsIcon
              @name='phone'
              @size='14'
              @title='landline number'
              @isInline={{true}}
            />
            <span data-test-person-badge-landline>
              {{this.person.landline}}
            </span>
          </a>
        {{/if}}
        {{#if this.person.selfNotes}}
          <HdsIcon
            @name='file-text'
            @size='14'
            @title='notes about self'
            @isInline={{true}}
          />
          <span data-test-person-badge-self-notes>
            {{this.person.selfNotes}}
          </span>
        {{/if}}
      </div>
    {{/if}}
  </template>
  showContact = false;

  @action
  toggleContact() {
    if (!this.isDestroying && !this.isDestroyed) {
      this.toggleProperty('showContact');
    }
  }
}

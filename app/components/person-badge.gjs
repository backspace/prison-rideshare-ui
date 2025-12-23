import { action } from '@ember/object';
import Component from '@glimmer/component';
import eq from 'ember-truth-helpers/helpers/eq';
import {
  HdsButton,
  HdsIcon,
} from '@hashicorp/design-system-components/components';
import { on } from '@ember/modifier';
import { tracked } from '@glimmer/tracking';

export default class PersonBadge extends Component {
  @tracked showContact = false;

  @action
  toggleContact() {
    if (!this.isDestroying && !this.isDestroyed) {
      this.showContact = !this.showContact;
    }
  }

  <template>
    {{! template-lint-disable no-invalid-interactive }}
    <div
      ...attributes
      class='person-badge'
      data-test-person-badge-toggle
      {{on 'click' this.toggleContact}}
    >
      <div class='row'>
        {{#if (eq @property 'driver')}}
          <HdsIcon @name='user' @size='16' @title='driver' @isInline={{true}} />
        {{else if (eq @property 'carOwner')}}
          <HdsIcon
            @name='car'
            @size='16'
            @title='car owner'
            @isInline={{true}}
          />
        {{/if}}
        <span data-test-person-badge-name>
          {{@person.name}}
        </span>
      </div>
      {{#if @clear}}
        <HdsButton
          class='clear'
          data-test-person-badge-clear
          {{on 'click' @clear}}
          @isIconOnly={{true}}
          @isInline={{true}}
          @icon='x'
          @text='Remove'
          @size='small'
          @color='tertiary'
        />
      {{/if}}
      {{#if this.showContact}}
        {{#if @person.email}}
          <a class='row' href='mailto:{{@person.email}}'>
            <HdsIcon
              @name='mail'
              @size='16'
              @title='email address'
              @isInline={{true}}
            />
            <span data-test-person-badge-email>
              {{@person.email}}
            </span>
          </a>
        {{/if}}
        {{#if @person.mobile}}
          <a class='row' href='tel:{{@person.mobile}}'>
            <HdsIcon
              @name='smartphone'
              @size='16'
              @title='mobile phone number'
              @isInline={{true}}
            />
            <span data-test-person-badge-mobile>
              {{@person.mobile}}
            </span>
          </a>
        {{/if}}
        {{#if @person.landline}}
          <a class='row' href='tel:{{@person.landline}}'>
            <HdsIcon
              @name='phone'
              @size='16'
              @title='landline number'
              @isInline={{true}}
            />
            <span data-test-person-badge-landline>
              {{@person.landline}}
            </span>
          </a>
        {{/if}}
        {{#if @person.selfNotes}}
          <div class='row'>
            <HdsIcon
              @name='file-text'
              @size='16'
              @title='notes about self'
              @isInline={{true}}
            />
            <span data-test-person-badge-self-notes>
              {{@person.selfNotes}}
            </span>
          </div>
        {{/if}}
      {{/if}}
    </div>
  </template>
}

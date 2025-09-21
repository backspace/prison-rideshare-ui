/* eslint-disable ember/no-classic-classes, ember/no-classic-components, ember/require-tagless-components */
import classic from 'ember-classic-decorator';
import { action } from '@ember/object';
import { classNames } from '@ember-decorators/component';
import Component from '@ember/component';
import eq from "ember-truth-helpers/helpers/eq";
import paperIcon from "ember-paper/components/paper-icon";

@classic
@classNames('person-badge')
export default class PersonBadge extends Component {<template>{{!-- template-lint-disable no-action no-invalid-interactive --}}
<div class="name-container" onclick={{this.toggleContact}}>
  {{#if (eq this.property "driver")}}
    {{paperIcon "person" size=14 title="driver"}}
  {{else if (eq this.property "carOwner")}}
    {{paperIcon "local gas station" size=14 title="car owner"}}
  {{/if}}
  <span class="name">
    {{this.person.name}}
  </span>
  {{#if this.clear}}
    <span class="remove-container">
      <button onclick={{action this.clear}} type="button">
        <paperIcon @icon="clear" @size={{14}} @title="remove" />
        <span class="md-visually-hidden">
          Remove
        </span>
      </button>
    </span>
  {{/if}}
</div>
{{#if this.showContact}}
  <div class="contact-container">
    {{#if this.person.email}}
      <a href="mailto:{{this.person.email}}">
        {{paperIcon "email" size=14 title="email address"}}
        <span class="email">
          {{this.person.email}}
        </span>
      </a>
    {{/if}}
    {{#if this.person.mobile}}
      <a href="tel:{{this.person.mobile}}">
        {{paperIcon "smartphone" size=14 title="mobile phone number"}}
        <span class="mobile">
          {{this.person.mobile}}
        </span>
      </a>
    {{/if}}
    {{#if this.person.landline}}
      <a href="tel:{{this.person.landline}}">
        {{paperIcon "phone" size=14 title="landline number"}}
        <span class="landline">
          {{this.person.landline}}
        </span>
      </a>
    {{/if}}
    {{#if this.person.selfNotes}}
      {{paperIcon "notes" size=14 title="notes about self"}}
      <span class="self-notes">
        {{this.person.selfNotes}}
      </span>
    {{/if}}
  </div>
{{/if}}</template>
  showContact = false;

  @action
  toggleContact() {
    if (!this.isDestroying && !this.isDestroyed) {
      this.toggleProperty('showContact');
    }
  }
}

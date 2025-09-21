/* eslint-disable ember/no-classic-classes, ember/no-classic-components, ember/no-get */
import classic from 'ember-classic-decorator';
import { tagName } from '@ember-decorators/component';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import PaperSwitch from "ember-paper/components/paper-switch";
import CopyButton from "ember-cli-clipboard/components/copy-button";
import paperIcon from "ember-paper/components/paper-icon";
import momentFormat from "ember-moment/helpers/moment-format";
import PaperButton from "ember-paper/components/paper-button";

@classic
@tagName('')
export default class PersonRow extends Component {<template>{{!-- template-lint-disable no-action --}}
<@body.row class="person" as |row|>
  <row.cell>
    <PaperSwitch @value={{this.person.active}} @onChange={{action "toggleActiveness"}} />
  </row.cell>
  <row.cell class="name">
    {{this.person.name}}
  </row.cell>
  <row.cell class={{this.emailClass}}>
    <a href="mailto:{{this.person.email}}">
      {{this.person.email}}
    </a>
  </row.cell>
  <row.cell class={{this.mobileClass}}>
    {{#if this.person.mobile}}
      <a href="tel:{{this.person.mobile}}">
        {{this.person.mobile}}
      </a>
    {{/if}}
  </row.cell>
  <row.cell class={{this.landlineClass}}>
    {{#if this.person.landline}}
      <a href="tel:{{this.person.landline}}">
        {{this.person.landline}}
      </a>
    {{/if}}
  </row.cell>
  <row.cell>
    {{#if this.person.address}}
      <CopyButton @text={{this.person.address}} @onSuccess={{action "copied"}}>
        {{paperIcon "content copy"}}
      </CopyButton>
    {{/if}}
  </row.cell>
  <row.cell class="last-ride">
    {{#if this.person.lastRide}}
      {{momentFormat this.person.lastRide.start "MMMM D, YYYY"}}
    {{/if}}
  </row.cell>
  <row.cell class="notes">
    {{this.person.notes}}
  </row.cell>
  <row.cell>
    <PaperButton @iconButton={{true}} @aria-label="Edit person" @title="Edit person" class="edit" @onClick={{action this.editPerson this.person}}>
      {{paperIcon "mode edit"}}
    </PaperButton>
  </row.cell>
</@body.row></template>
  @service
  toasts;

  @computed('person.medium')
  get emailClass() {
    return `email ${
      this.get('person.medium') === 'email' ? 'is-preferred' : ''
    }`;
  }

  @computed('person.medium')
  get mobileClass() {
    return `mobile ${
      this.get('person.medium') === 'mobile' ? 'is-preferred' : ''
    }`;
  }

  @computed('person.medium')
  get landlineClass() {
    return `landline ${
      this.get('person.medium') === 'landline' ? 'is-preferred' : ''
    }`;
  }

  @action
  copied() {
    this.toasts.show('Copied address');
  }

  @action
  toggleActiveness(active) {
    this.set('person.active', active);
    this.person.save().catch(() => {
      this.toasts.show(
        `There was an error saving the active status of ${this.get(
          'person.name'
        )}`
      );
    });
  }
}

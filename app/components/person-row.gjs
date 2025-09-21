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
    <PaperSwitch @value={{@person.active}} @onChange={{this.toggleActiveness}} />
  </row.cell>
  <row.cell class="name">
    {{@person.name}}
  </row.cell>
  <row.cell class={{this.emailClass}}>
    <a href="mailto:{{@person.email}}">
      {{@person.email}}
    </a>
  </row.cell>
  <row.cell class={{this.mobileClass}}>
    {{#if @person.mobile}}
      <a href="tel:{{@person.mobile}}">
        {{@person.mobile}}
      </a>
    {{/if}}
  </row.cell>
  <row.cell class={{this.landlineClass}}>
    {{#if @person.landline}}
      <a href="tel:{{@person.landline}}">
        {{@person.landline}}
      </a>
    {{/if}}
  </row.cell>
  <row.cell>
    {{#if @person.address}}
      <CopyButton @text={{@person.address}} @onSuccess={{this.copied}}>
        {{paperIcon "content copy"}}
      </CopyButton>
    {{/if}}
  </row.cell>
  <row.cell class="last-ride">
    {{#if @person.lastRide}}
      {{momentFormat @person.lastRide.start "MMMM D, YYYY"}}
    {{/if}}
  </row.cell>
  <row.cell class="notes">
    {{@person.notes}}
  </row.cell>
  <row.cell>
    <PaperButton @iconButton={{true}} @aria-label="Edit person" @title="Edit person" class="edit" @onClick={{this.edit}}>
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

  @action edit() {
    this.editPerson(this.person);
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

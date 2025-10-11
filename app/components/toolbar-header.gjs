/* eslint-disable ember/no-classic-components, ember/require-tagless-components */
import classic from 'ember-classic-decorator';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';
import Component from '@ember/component';
import { on } from '@ember/modifier';
import pluralize from 'ember-inflector/lib/helpers/pluralize';
import { pageTitle } from 'ember-page-title';
import {
  HdsAppHeader,
  HdsButton,
  HdsTag,
} from '@hashicorp/design-system-components/components';

@classic
export default class ToolbarHeader extends Component {
  <template>
    {{#if @titleOverride}}
      {{pageTitle @titleOverride}}
    {{else}}
      {{pageTitle this.title}}
    {{/if}}
    <HdsAppHeader>
      <:globalActions>
        <h2>
          {{this.title}}
        </h2>
      </:globalActions>
      <:utilityActions>
        <HdsButton
          @text='Toggle sidebar'
          @icon='menu'
          @isIconOnly={{true}}
          @size='small'
          class='hide-gt-sm'
          {{on 'click' this.toggleSidebar}}
        />
        {{#each this.chips as |chip|}}
          <HdsTag @text={{chip.label}} title={{chip.title}} />
        {{/each}}
        {{yield}}
        {{#if this.session.currentUser.admin}}
          {{#if this.sidebar.notificationCount}}
            <span
              class='count hide-gt-sm'
              title='Check on {{pluralize
                this.sidebar.notificationCount
                "notification"
              }}'
            >
              {{this.sidebar.notificationCount}}
            </span>
          {{/if}}
        {{/if}}
      </:utilityActions>
    </HdsAppHeader>
  </template>
  @service
  session;

  @service
  sidebar;

  @alias('sidebar.open')
  sidebarOpen;

  @computed
  get chips() {
    const hostname = window.location.hostname;

    if (hostname.indexOf('sandbox') > -1) {
      return [
        {
          label: 'Sandbox',
          title:
            'All data on this instance is erased daily. If some type of example data would be useful for you, let Buck know.',
        },
      ];
    } else {
      return [];
    }
  }

  @action
  toggleSidebar() {
    this.toggleProperty('sidebarOpen');
  }
}

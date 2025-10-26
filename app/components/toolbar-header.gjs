import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { on } from '@ember/modifier';
import { pageTitle } from 'ember-page-title';
import {
  HdsAppHeader,
  HdsBadgeCount,
  HdsButton,
  HdsTag,
} from '@hashicorp/design-system-components/components';
import { inject as controller } from '@ember/controller';

export default class ToolbarHeader extends Component {
  @controller application;
  @service sidebar;

  get isSandbox() {
    return window.location.hostname.indexOf('sandbox') > -1;
  }

  get toggleLabel() {
    return this.sidebar.open ? 'Close navigation menu' : 'Open navigation menu';
  }

  get showToggleBadge() {
    return !this.sidebar.open && Boolean(this.sidebar.notificationCount);
  }

  @action
  toggleSidebar() {
    this.sidebar.open = !this.sidebar.open;
  }

  <template>
    {{#if @titleOverride}}
      {{pageTitle @titleOverride}}
    {{else}}
      {{pageTitle @title}}
    {{/if}}

    {{#if this.application.headerElement}}
      {{#in-element this.application.headerElement}}
        <HdsAppHeader>
          <:logo>
            <span class='header-toggle'>
              <HdsButton
                @color='secondary'
                @icon='menu'
                @isIconOnly={{true}}
                @size='small'
                @text={{this.toggleLabel}}
                {{on 'click' this.toggleSidebar}}
                data-test-sidebar-toggle
              />
              {{#if this.showToggleBadge}}
                <HdsBadgeCount
                  @text={{this.sidebar.notificationCount}}
                  @type='filled'
                  @size='small'
                  class='header-toggle-badge'
                  data-test-sidebar-toggle-badge
                />
              {{/if}}
            </span>
          </:logo>
          <:globalActions>
            <h2>
              {{@title}}
            </h2>
          </:globalActions>
          <:utilityActions>
            {{#if this.isSandbox}}
              <HdsTag
                @text='Sandbox'
                title='All data on this instance is erased daily. If some type of example data would be useful for you, let Buck know.'
              />
            {{/if}}
            {{yield}}
          </:utilityActions>
        </HdsAppHeader>
      {{/in-element}}
    {{/if}}
  </template>
}

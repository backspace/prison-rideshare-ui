import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { on } from '@ember/modifier';
import { pageTitle } from 'ember-page-title';
import {
  HdsBadgeCount,
  HdsButton,
  HdsTag,
} from '@hashicorp/design-system-components/components';
import { inject as controller } from '@ember/controller';
import { runTask } from 'ember-lifeline';

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
    const navExpanded =
      Boolean(this.sidebar.navComponent) && !this.sidebar.navIsMinimized;

    if (navExpanded) {
      const collapsed = this.sidebar.collapseNavIfNeeded();

      this.sidebar.open = false;

      if (!collapsed) {
        this.sidebar.setNavMinimizedState(true);
      }
    } else {
      this.sidebar.open = true;
      runTask(this.sidebar, this.sidebar.expandNavIfNeeded);
    }
  }

  <template>
    {{#if @titleOverride}}
      {{pageTitle @titleOverride}}
    {{else}}
      {{pageTitle @title}}
    {{/if}}

    {{#if this.application.headerElement}}
      {{#in-element this.application.headerElement}}
        <header class='app-header'>
          <div class='app-header__left'>
            <span class='header-toggle'>
              <HdsButton
                @icon='menu'
                @isIconOnly={{true}}
                @size='small'
                @text={{this.toggleLabel}}
                {{on 'click' this.toggleSidebar}}
                class='header-toggle-button'
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
          </div>
          <div class='app-header__title'>
            <h1 class='app-header__heading'>
              {{@title}}
            </h1>
          </div>
          <div class='app-header__actions'>
            {{#if this.isSandbox}}
              <HdsTag
                @text='Sandbox'
                title='All data on this instance is erased daily. If some type of example data would be useful for you, let Buck know.'
              />
            {{/if}}
            {{yield}}
          </div>
        </header>
      {{/in-element}}
    {{/if}}
  </template>
}

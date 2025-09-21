/* eslint-disable ember/no-classic-components, ember/require-tagless-components */
import classic from 'ember-classic-decorator';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';
import Component from '@ember/component';

@classic
export default class ToolbarHeader extends Component {
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

{{! template-lint-disable no-action }}
<PaperToolbar as |toolbar|>
  <toolbar.tools>
    <PaperButton
      @iconButton={{true}}
      @onClick={{action 'toggleSidebar'}}
      @class='hide-gt-sm'
    >
      {{paper-icon 'menu'}}
    </PaperButton>
    {{#if this.session.currentUser.admin}}
      {{#if this.sidebar.notificationCount}}
        <span
          class='count hide-gt-sm'
          title='Check on {{
            pluralize this.sidebar.notificationCount 'notification'
          }}'
        >
          {{this.sidebar.notificationCount}}
        </span>
      {{/if}}
    {{/if}}
    <h2>
      {{this.title}}
    </h2>
    <PaperChips @readOnly={{true}} @content={{this.chips}} as |item|>
      <span title={{item.title}}>
        {{item.label}}
      </span>
    </PaperChips>
    <span class='flex'></span>
    {{yield}}
  </toolbar.tools>
</PaperToolbar>
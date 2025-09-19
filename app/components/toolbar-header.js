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

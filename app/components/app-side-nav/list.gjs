import Component from '@glimmer/component';
import { hash } from '@ember/helper';
import Link from 'prison-rideshare-ui/components/app-side-nav/link';
import Item from 'prison-rideshare-ui/components/app-side-nav/item';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { on } from '@ember/modifier';

// See docs/helios-overrides.md
export default class AppSideNavListComponent extends Component {
  @service sidebar;

  @action handleNavClick(event) {
    if (typeof window === 'undefined') {
      return;
    }

    const isDesktop = window.matchMedia?.('(min-width: 1088px)')?.matches;

    if (isDesktop) {
      return;
    }

    if (event.target.closest('.app-side-nav__link')) {
      this.sidebar.open = false;
      this.sidebar.setNavMinimizedState(true);
    }
  }

  <template>
    {{! Delegated click handler closes the nav on mobile; interactive behavior is intentional. }}
    {{! template-lint-disable no-invalid-interactive }}
    <nav
      class='app-side-nav__nav'
      {{on 'click' this.handleNavClick capture=true}}
    >
      <ul class='app-side-nav__list'>
        {{yield (hash Link=Link Item=Item)}}
      </ul>
    </nav>
    {{! template-lint-enable no-invalid-interactive }}
  </template>
}

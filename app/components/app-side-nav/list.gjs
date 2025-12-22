import { component } from '@ember/component/helper';
import Component from '@glimmer/component';
import { hash } from '@ember/helper';
import Link from 'prison-rideshare-ui/components/app-side-nav/link';
import Item from 'prison-rideshare-ui/components/app-side-nav/item';

// See docs/helios-overrides.md
export default class AppSideNavListComponent extends Component {
  <template>
    <nav class='app-side-nav__nav'>
      <ul class='app-side-nav__list'>
        {{yield (hash Link=Link Item=Item)}}
      </ul>
    </nav>
  </template>
}

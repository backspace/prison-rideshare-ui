import Component from '@glimmer/component';

export default class AppSideNavItemComponent extends Component {
  <template>
    <li class='app-side-nav__item' ...attributes>
      {{yield}}
    </li>
  </template>
}

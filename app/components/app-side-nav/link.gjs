import Component from '@glimmer/component';
import { LinkComponent } from '@ember/legacy-built-in-components';

// See docs/helios-overrides.md
export default class AppSideNavLinkComponent extends Component {
  get hasModel() {
    return this.args.model !== undefined && this.args.model !== null;
  }

  <template>
    <li class='app-side-nav__item'>
      {{#if this.hasModel}}
        <LinkComponent
          @route={{@route}}
          @model={{@model}}
          @activeClass='app-side-nav__link--active'
          class='app-side-nav__link'
          ...attributes
        >
          <span class='app-side-nav__link-label'>
            {{@text}}
          </span>
          {{yield}}
        </LinkComponent>
      {{else}}
        <LinkComponent
          @route={{@route}}
          @activeClass='app-side-nav__link--active'
          class='app-side-nav__link'
          ...attributes
        >
          <span class='app-side-nav__link-label'>
            {{@text}}
          </span>
          {{yield}}
        </LinkComponent>
      {{/if}}
    </li>
  </template>
}

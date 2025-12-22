import Component from '@glimmer/component';
import LinkTo from '@ember/routing/link-component';

// See docs/helios-overrides.md
export default class AppSideNavLinkComponent extends Component {
  get hasModel() {
    return this.args.model !== undefined && this.args.model !== null;
  }

  <template>
    <li class='app-side-nav__item'>
      {{#if this.hasModel}}
        <LinkTo
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
        </LinkTo>
      {{else}}
        <LinkTo
          @route={{@route}}
          @activeClass='app-side-nav__link--active'
          class='app-side-nav__link'
          ...attributes
        >
          <span class='app-side-nav__link-label'>
            {{@text}}
          </span>
          {{yield}}
        </LinkTo>
      {{/if}}
    </li>
  </template>
}

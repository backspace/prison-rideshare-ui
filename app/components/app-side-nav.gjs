import { component } from '@ember/component/helper';
import { action } from '@ember/object';
import Component from '@glimmer/component';
import { on } from '@ember/modifier';
import { hash } from '@ember/helper';
import List from 'prison-rideshare-ui/components/app-side-nav/list';

// See docs/helios-overrides.md
export default class AppSideNavComponent extends Component {
  constructor(owner, args) {
    super(owner, args);

    this.args?.onRegister?.(this);
  }

  willDestroy() {
    super.willDestroy(...arguments);

    this.args?.onRegister?.(null);
  }

  get isMinimized() {
    return Boolean(this.args.isMinimized);
  }

  get isResponsive() {
    return Boolean(this.args.isResponsive);
  }

  get state() {
    return this.isMinimized ? 'closed' : 'open';
  }

  get navClasses() {
    return `app-side-nav app-side-nav--${this.state}`;
  }

  get showScrim() {
    return this.isResponsive && !this.isMinimized;
  }

  @action
  toggleMinimizedStatus() {
    const nextState = !this.isMinimized;

    this.args?.onToggleMinimizedStatus?.(nextState);
  }

  <template>
    <div
      class={{this.navClasses}}
      data-state={{this.state}}
      data-test-app-sidenav
      aria-hidden={{this.isMinimized}}
      ...attributes
    >
      <div class='app-side-nav__panel'>
        <div class='app-side-nav__scroll'>
          {{yield (hash List=List)}}
        </div>
      </div>

      {{#if this.isResponsive}}
        <button
          type='button'
          class='app-side-nav__scrim'
          hidden={{this.isMinimized}}
          aria-label='Close navigation menu'
          {{on 'click' this.toggleMinimizedStatus}}
        />
      {{/if}}
    </div>
  </template>
}

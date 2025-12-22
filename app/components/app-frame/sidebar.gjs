import Component from '@glimmer/component';

// See docs/helios-overrides.md
export default class AppFrameSidebarComponent extends Component {
  <template>
    <aside class='app-frame__sidebar' ...attributes>
      {{yield}}
    </aside>
  </template>
}

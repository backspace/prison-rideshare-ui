import Component from '@glimmer/component';

export default class AppFrameHeaderComponent extends Component {
  <template>
    <header class='app-frame__header' ...attributes>
      {{yield}}
    </header>
  </template>
}

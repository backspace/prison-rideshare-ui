import Component from '@glimmer/component';

export default class AppFrameMainComponent extends Component {
  <template>
    <main class='app-frame__main' ...attributes>
      {{yield}}
    </main>
  </template>
}

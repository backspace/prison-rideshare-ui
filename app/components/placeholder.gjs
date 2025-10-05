import Component from '@glimmer/component';

export default class Placeholder extends Component {
  <template>
    <span ...attributes>
      {{yield}}
    </span>
  </template>
}

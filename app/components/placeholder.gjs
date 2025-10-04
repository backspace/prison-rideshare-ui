import Component from '@glimmer/component';

export default class Placeholder extends Component {
  <template>
    {{! template-lint-disable no-yield-only }}
    {{yield}}
  </template>
}

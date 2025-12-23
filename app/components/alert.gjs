import Component from '@glimmer/component';
import { HdsAlert } from '@hashicorp/design-system-components/components';

export default class Alert extends Component {
  get color() {
    return this.args.color ?? 'critical';
  }

  get type() {
    return this.args.type ?? 'inline';
  }

  <template>
    <HdsAlert
      @color={{this.color}}
      @type={{this.type}}
      data-test-inline-alert
      ...attributes
      as |Alert|
    >
      <Alert.Title data-test-inline-alert-text>
        {{#if (has-block)}}
          {{yield}}
        {{else}}
          {{@message}}
        {{/if}}
      </Alert.Title>
    </HdsAlert>
  </template>
}

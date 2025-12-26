/* eslint-disable ember/no-classic-classes, ember/no-classic-components, ember/require-tagless-components */
import { classNames, tagName } from '@ember-decorators/component';
import Component from '@ember/component';

@tagName('span')
@classNames('unit')
export default class ReimbursementUnit extends Component {
  <template>
    <sup>¢</sup>&frasl;<sub>km</sub>
  </template>
}

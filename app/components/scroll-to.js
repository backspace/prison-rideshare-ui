import classic from 'ember-classic-decorator';
/* eslint-disable ember/no-classic-classes, ember/no-classic-components, ember/no-component-lifecycle-hooks, ember/require-tagless-components */
import Component from '@ember/component';

@classic
export default class ScrollTo extends Component {
  didInsertElement() {
    super.didInsertElement(...arguments);
    this.element.scrollIntoView();
  }
}

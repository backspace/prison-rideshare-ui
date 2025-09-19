import classic from 'ember-classic-decorator';
import Component from '@ember/component';

@classic
export default class ScrollTo extends Component {
  didInsertElement() {
    super.didInsertElement(...arguments);
    this.element.scrollIntoView();
  }
}

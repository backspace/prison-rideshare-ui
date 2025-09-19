import classic from 'ember-classic-decorator';
import { action } from '@ember/object';
import { classNames } from '@ember-decorators/component';
import Component from '@ember/component';

@classic
@classNames('person-badge')
export default class PersonBadge extends Component {
  showContact = false;

  @action
  toggleContact() {
    if (!this.isDestroying && !this.isDestroyed) {
      this.toggleProperty('showContact');
    }
  }
}

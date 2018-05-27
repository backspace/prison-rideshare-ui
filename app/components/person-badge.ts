import Component from '@ember/component';

export default class PersonBadge extends Component {
  classNames = ['person-badge'];

  showContact = false;

  actions = {
    toggleContact(this: PersonBadge) {
      this.toggleProperty('showContact');
    }
  }
};

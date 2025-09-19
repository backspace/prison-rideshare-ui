import classic from 'ember-classic-decorator';
import { tagName } from '@ember-decorators/component';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

@classic
@tagName('')
export default class PersonRow extends Component {
  @service
  toasts;

  @computed('person.medium')
  get emailClass() {
    return `email ${
      this.get('person.medium') === 'email' ? 'is-preferred' : ''
    }`;
  }

  @computed('person.medium')
  get mobileClass() {
    return `mobile ${
      this.get('person.medium') === 'mobile' ? 'is-preferred' : ''
    }`;
  }

  @computed('person.medium')
  get landlineClass() {
    return `landline ${
      this.get('person.medium') === 'landline' ? 'is-preferred' : ''
    }`;
  }

  @action
  copied() {
    this.toasts.show('Copied address');
  }

  @action
  toggleActiveness(active) {
    this.set('person.active', active);
    this.person.save().catch(() => {
      this.toasts.show(
        `There was an error saving the active status of ${this.get(
          'person.name'
        )}`
      );
    });
  }
}

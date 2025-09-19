import classic from 'ember-classic-decorator';
import { tagName } from '@ember-decorators/component';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';
import Component from '@ember/component';

@classic
@tagName('')
export default class RidePerson extends Component {
  @service('people')
  peopleService;

  @alias('peopleService.active')
  people;

  @computed('ride', 'property', 'ride.{carOwner.id,driver.id}')
  get person() {
    return this.ride.get(this.property);
  }

  showContact = false;

  @action
  clear() {
    const ride = this.ride;
    ride.set(this.property, null);
    return ride.save();
  }
}

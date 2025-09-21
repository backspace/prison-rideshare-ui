/* eslint-disable ember/no-classic-components */
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

{{! template-lint-disable no-action }}
{{#if this.person}}
  <span class='ride-person'>
    <PersonBadge
      @person={{this.person}}
      @property={{this.property}}
      @clear={{action 'clear'}}
    />
  </span>
{{else}}
  <PaperSelect
    @selected={{this.person}}
    @options={{this.people}}
    @onChange={{this.onChange}}
    @allowClear={{true}}
    @searchField='name' as |person|
  >
    {{person.name}}
  </PaperSelect>
{{/if}}
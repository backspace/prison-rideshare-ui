/* eslint-disable ember/no-classic-components */
import classic from 'ember-classic-decorator';
import { tagName } from '@ember-decorators/component';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';
import Component from '@ember/component';
import PersonBadge from 'prison-rideshare-ui/components/person-badge';
import PaperSelect from 'prison-rideshare-ui/components/placeholder';

@classic
@tagName('')
export default class RidePerson extends Component {
  <template>
    {{#if this.person}}
      <span class='ride-person'>
        <PersonBadge
          @person={{this.person}}
          @property={{this.property}}
          @clear={{this.clear}}
        />
      </span>
    {{else}}
      <PaperSelect
        @selected={{this.person}}
        @options={{this.people}}
        @onChange={{this.onChange}}
        @allowClear={{true}}
        @searchField='name'
        as |person|
      >
        {{person.name}}
      </PaperSelect>
    {{/if}}
  </template>
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

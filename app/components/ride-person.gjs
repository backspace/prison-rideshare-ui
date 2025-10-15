/* eslint-disable ember/no-classic-components */
import classic from 'ember-classic-decorator';
import { tagName } from '@ember-decorators/component';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';
import Component from '@ember/component';
import PersonBadge from 'prison-rideshare-ui/components/person-badge';
import { HdsFormSuperSelectSingleField } from '@hashicorp/design-system-components/components';

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
      <HdsFormSuperSelectSingleField
        data-test-ride-person-select={{this.property}}
        @options={{this.people}}
        @selected={{this.person}}
        @searchField='name'
        @allowClear={{true}}
        @onChange={{this.onChange}}
        as |F|
      >
        <F.Options>
          {{#let F.options as |option|}}
            {{option.name}}
          {{/let}}
        </F.Options>
      </HdsFormSuperSelectSingleField>
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

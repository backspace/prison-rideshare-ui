import { tagName } from '@ember-decorators/component';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';
import Component from '@glimmer/component';
import PersonBadge from 'prison-rideshare-ui/components/person-badge';
import { HdsFormSuperSelectSingleField } from '@hashicorp/design-system-components/components';
import { tracked } from '@glimmer/tracking';

export default class RidePerson extends Component {
  @service('people') peopleService;

  @tracked showContact = false;

  get person() {
    return this.args.ride.get(this.args.property);
  }

  get placeholder() {
    return this.args.property === 'driver' ? 'Driver' : 'Car Owner';
  }

  @action
  clear() {
    const ride = this.ride;
    ride.set(this.property, null);
    return ride.save();
  }

  <template>
    {{#if this.person}}
      <span class='ride-person' ...attributes>
        <PersonBadge
          @person={{this.person}}
          @property={{@property}}
          @clear={{@clear}}
        />
      </span>
    {{else}}
      <HdsFormSuperSelectSingleField
        data-test-ride-person-select={{@property}}
        @placeholder={{this.placeholder}}
        @options={{this.peopleService.active}}
        @selected={{this.person}}
        @searchField='name'
        @allowClear={{true}}
        @onChange={{@onChange}}
        ...attributes
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
}

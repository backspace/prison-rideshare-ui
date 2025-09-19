import classic from 'ember-classic-decorator';
import { tagName } from '@ember-decorators/component';
import { inject as service } from '@ember/service';
import { get, action, computed } from '@ember/object';
import Component from '@ember/component';
import reasonToIcon from 'prison-rideshare-ui/utils/reason-to-icon';
import fetch from 'fetch';

const mediumIcon = {
  txt: 'textsms',
  email: 'email',
  phone: 'phone',
};

@classic
@tagName('')
export default class RideRow extends Component {
  @computed(
    'uncombinable',
    'ride.{isCombined,isDivider,enabled,requiresConfirmation}',
    'commitments.[]'
  )
  get classAttribute() {
    return `ride ${this.get('ride.enabled') ? 'enabled' : ''} ${
      this.uncombinable ? 'uncombinable' : ''
    } ${this.get('ride.isCombined') ? 'combined' : ''} ${
      this.get('ride.isDivider') ? 'divider' : ''
    } ${
      this.get('ride.requiresConfirmation') || this.get('commitments.length')
        ? 'highlighted'
        : ''
    }`;
  }

  @service
  moment;

  @service
  overlaps;

  @service
  session;

  @service
  store;

  // TODO this is unfortunate but without it ignoring doesn’t make the overlap immediately disappear
  @computed('overlaps.overlaps.data.@each.id', 'ride')
  get commitments() {
    return this.overlaps.commitmentsForRide(this.ride);
  }

  clearing = false;

  @computed('ride.insertedAt')
  get creation() {
    const insertedAt = this.get('ride.insertedAt');

    return this.moment.moment(insertedAt).format('ddd MMM D YYYY h:mma');
  }

  @computed('ride.cancellationReason')
  get cancellationIcon() {
    const reason = this.get('ride.cancellationReason');
    const icon = reasonToIcon[reason];

    return icon || 'help';
  }

  @computed('ride.{enabled,cancellationReason}')
  get cancellationButtonLabel() {
    if (this.get('ride.enabled')) {
      return 'Cancel ride';
    } else {
      return `Edit cancellation: ${this.get('ride.cancellationReason')}`;
    }
  }

  @computed('ride.id', 'rideToCombine.id')
  get combineButtonLabel() {
    if (this.get('ride.id') == this.get('rideToCombine.id')) {
      return 'Cancel combining';
    } else {
      return 'Combine with another ride';
    }
  }

  @computed('rideToCombine.{id,start}', 'ride.start')
  get uncombinable() {
    const sixHours = 1000 * 60 * 60 * 6;
    const rideToCombineStart = this.get('rideToCombine.start');

    if (!rideToCombineStart) {
      return false;
    } else {
      return (
        Math.abs(
          new Date(rideToCombineStart).getTime() -
            new Date(this.get('ride.start')).getTime()
        ) > sixHours
      );
    }
  }

  @computed('ride.medium')
  get mediumIcon() {
    return mediumIcon[this.get('ride.medium')];
  }

  @computed('ride.medium')
  get mediumIconTitle() {
    return `ride was requested via ${this.get('ride.medium')}`;
  }

  @action
  setDriver(driver) {
    const ride = this.ride;

    ride.set('driver', driver);

    return ride
      .get('carOwner')
      .then((carOwner) => {
        if (!carOwner) {
          ride.set('carOwner', driver);
        }

        return ride.save();
      })
      .then(() => this.overlaps.fetch());
  }

  @action
  setCarOwner(carOwner) {
    const ride = this.ride;

    ride.set('carOwner', carOwner);
    return ride.save();
  }

  @action
  assignFromCommitment(commitmentJson) {
    let person = this.store.peekRecord(
      'person',
      commitmentJson.relationships.person.data.id
    );

    this.send('setDriver', person);
  }

  @action
  ignoreCommitment(commitmentJson) {
    let ride = this.ride;
    let url = `${ride.store
      .adapterFor('ride')
      .buildURL('ride', ride.id)}/ignore/${commitmentJson.id}`;
    let token = this.get('session.data.authenticated.access_token');

    fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(() => {
      return this.overlaps.fetch();
    });
  }

  @action
  markConfirmed() {
    let ride = this.ride;
    ride.set('requestConfirmed', true);
    return ride.save();
  }

  @action
  match(option, searchTerm) {
    const name = option.name;
    const result = (name || '')
      .toLowerCase()
      .startsWith(searchTerm.toLowerCase());

    return result ? 1 : -1;
  }

  @action
  toggleCreation() {
    this.toggleProperty('showCreation');
  }

  @action
  proposeClear() {
    this.set('clearing', true);
  }

  @action
  clearReport() {
    this.set('ride.donation', null);
    this.set('ride.distance', null);
    this.set('ride.reportNotes', null);
    this.set('ride.foodExpenses', 0);
    this.set('ride.carExpenses', 0);
    this.set('ride.complete', false);

    this.ride.save();
  }
}

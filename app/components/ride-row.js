import { computed, get } from '@ember/object';
import Component from '@ember/component';
import { inject as service } from '@ember/service';
import reasonToIcon from 'prison-rideshare-ui/utils/reason-to-icon';
import fetch from 'fetch';
import moment from 'moment';

const mediumIcon = {
  txt: 'textsms',
  email: 'email',
  phone: 'phone'
};

export default Component.extend({
  classAttribute: computed('uncombinable', 'ride.{isCombined,isDivider,enabled}', 'commitments.[]', function() {
    return `ride ${this.get('ride.enabled') ? 'enabled' : ''} ${this.get('uncombinable') ? 'uncombinable' : ''} ${this.get('ride.isCombined') ? 'combined' : ''} ${this.get('ride.isDivider') ? 'divider' : ''} ${this.get('commitments.length') ? 'overlaps' : ''}`;
  }),

  tagName: '',

  overlaps: service(),
  session: service(),
  store: service(),

  commitments: computed('overlaps.rideIds.[]', function() {
    return this.get('overlaps').commitmentsForRide(this.get('ride'));
  }),

  clearing: false,

  creation: computed('ride.insertedAt', function () {
    const insertedAt = this.get('ride.insertedAt');

    return moment(insertedAt).format('ddd MMM D YYYY h:mma');
  }),

  cancellationIcon: computed('ride.cancellationReason', function() {
    const reason = this.get('ride.cancellationReason');
    const icon = reasonToIcon[reason];

    return icon || 'help';
  }),

  cancellationButtonLabel: computed('ride.{enabled,cancellationReason}', function() {
    if (this.get('ride.enabled')) {
      return 'Cancel ride';
    } else {
      return `Edit cancellation: ${this.get('ride.cancellationReason')}`;
    }
  }),

  combineButtonLabel: computed('ride.id', 'rideToCombine.id', function() {
    if (this.get('ride.id') == this.get('rideToCombine.id')) {
      return 'Cancel combining';
    } else {
      return 'Combine with another ride';
    }
  }),

  uncombinable: computed('rideToCombine.{id,start}', 'ride.start', function() {
    const sixHours = 1000*60*60*6;
    const rideToCombineStart = this.get('rideToCombine.start');

    if (!rideToCombineStart) {
      return false;
    } else {
      return Math.abs(new Date(rideToCombineStart).getTime() - new Date(this.get('ride.start')).getTime()) > sixHours;
    }

  }),

  mediumIcon: computed('ride.medium', function() {
    return mediumIcon[this.get('ride.medium')];
  }),

  mediumIconTitle: computed('ride.medium', function() {
    return `ride was requested via ${this.get('ride.medium')}`;
  }),

  actions: {
    setDriver(driver) {
      const ride = this.get('ride');

      ride.set('driver', driver);

      return ride.get('carOwner').then(carOwner => {
        if (!carOwner) {
          ride.set('carOwner', driver);
        }

        return ride.save();
      }).then(() => this.get('overlaps').fetch());
    },

    setCarOwner(carOwner) {
      const ride = this.get('ride');

      ride.set('carOwner', carOwner);
      return ride.save();
    },

    assignFromCommitment(commitmentJson) {
      let person = this.get('store').peekRecord('person', commitmentJson.relationships.person.data.id);

      this.send('setDriver', person);
    },

    ignoreCommitment(commitmentJson) {
      let ride = this.get('ride');
      let url = `${ride.store.adapterFor('ride').buildURL('ride', ride.id)}/ignore/${commitmentJson.id}`;
      let token = this.get('session.data.authenticated.access_token');

      fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).then(() => {
        return this.get('overlaps').fetch();
      });
    },

    match(option, searchTerm) {
      const name = get(option, 'name');
      const result = (name || '').toLowerCase().startsWith(searchTerm.toLowerCase());

      return result ? 1 : -1;
    },

    toggleCreation() {
      this.toggleProperty('showCreation');
    },

    proposeClear() {
      this.set('clearing', true)
    },

    clearReport() {
      this.set('ride.donation', null);
      this.set('ride.distance', null);
      this.set('ride.reportNotes', null);
      this.set('ride.foodExpenses', 0);
      this.set('ride.carExpenses', 0);

      this.get('ride').save();
    }
  }
});

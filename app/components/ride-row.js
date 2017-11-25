import { computed, get } from '@ember/object';
import Component from '@ember/component';
import reasonToIcon from 'prison-rideshare-ui/utils/reason-to-icon';

const mediumIcon = {
  txt: 'textsms',
  email: 'email',
  phone: 'phone'
};

export default Component.extend({
  classAttribute: computed('ride.enabled', 'uncombinable', 'ride.isCombined', function() {
    return `ride ${this.get('ride.enabled') ? 'enabled' : ''} ${this.get('uncombinable') ? 'uncombinable' : ''} ${this.get('ride.isCombined') ? 'combined' : ''}`;
  }),

  tagName: '',

  cancellationIcon: computed('ride.cancellationReason', function() {
    const reason = this.get('ride.cancellationReason');
    const icon = reasonToIcon[reason];

    return icon || 'help';
  }),

  cancellationButtonLabel: computed('ride.enabled', 'ride.cancellationReason', function() {
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

  uncombinable: computed('rideToCombine.id', 'rideToCombine.start', 'ride.start', function() {
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
      });
    },

    setCarOwner(carOwner) {
      const ride = this.get('ride');

      ride.set('carOwner', carOwner);
      return ride.save();
    },

    match(option, searchTerm) {
      const name = get(option, 'name');
      const result = (name || '').toLowerCase().startsWith(searchTerm.toLowerCase());

      return result ? 1 : -1;
    }
  }
});

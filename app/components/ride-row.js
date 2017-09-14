import Ember from 'ember';
import reasonToIcon from 'prison-rideshare-ui/utils/reason-to-icon';

export default Ember.Component.extend({
  classAttribute: Ember.computed('ride.enabled', 'uncombinable', function() {
    return `ride ${this.get('ride.enabled') ? 'enabled' : ''} ${this.get('uncombinable') ? 'uncombinable' : ''}`;
  }),

  tagName: '',

  cancellationIcon: Ember.computed('ride.cancellationReason', function() {
    const reason = this.get('ride.cancellationReason');
    const icon = reasonToIcon[reason];

    return icon || 'help';
  }),

  cancellationButtonLabel: Ember.computed('ride.enabled', 'ride.cancellationReason', function() {
    if (this.get('ride.enabled')) {
      return 'Cancel ride';
    } else {
      return `Edit cancellation: ${this.get('ride.cancellationReason')}`;
    }
  }),

  combineButtonLabel: Ember.computed('ride.id', 'rideToCombine.id', function() {
    if (this.get('ride.id') == this.get('rideToCombine.id')) {
      return 'Cancel combining';
    } else {
      return 'Combine with another ride';
    }
  }),

  uncombinable: Ember.computed('rideToCombine.id', 'rideToCombine.start', 'ride.start', function() {
    const sixHours = 1000*60*60*6;
    const rideToCombineStart = this.get('rideToCombine.start');

    if (!rideToCombineStart) {
      return false;
    } else {
      return Math.abs(new Date(rideToCombineStart).getTime() - new Date(this.get('ride.start')).getTime()) > sixHours;
    }

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
      const name = Ember.get(option, 'name');
      const result = (name || '').toLowerCase().startsWith(searchTerm.toLowerCase());

      return result ? 1 : -1;
    }
  }
});

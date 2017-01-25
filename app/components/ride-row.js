import Ember from 'ember';

const reasonToIcon = {
  'lockdown': 'lock',
  'visitor': 'perm identity',
  'no car': 'directions car',
  // FIXME better icon!
  'no driver': 'rowing',
  'weather': 'cloud',
  'transfer': 'shuffle',
  'error': 'error',
  'visitor missing': 'perm identity',
  'driver missing': 'directions car'
};

export default Ember.Component.extend({
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
    }
  }
});

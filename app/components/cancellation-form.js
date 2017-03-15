import Ember from 'ember';

import reasonToIcon from 'prison-rideshare-ui/utils/reason-to-icon';

const reasons = Object.keys(reasonToIcon);

export default Ember.Component.extend({
  reasons,

  actions: {
    cancelledChanged(cancelled) {
      if (!cancelled) {
        this.set('ride.cancellationReason', null);
      }

      this.set('ride.cancelled', cancelled);
    }
  }
});

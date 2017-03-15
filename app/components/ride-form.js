import Ember from 'ember';

export default Ember.Component.extend({
  institutionsService: Ember.inject.service('institutions'),
  institutions: Ember.computed.alias('institutionsService.all'),

  warning: Ember.computed('ride.cancellationReason', function() {
    const reason = this.get('ride.cancellationReason');

    if (reason) {
      return 'You are editing a cancelled ride!';
    } else {
      return false;
    }
  })
});

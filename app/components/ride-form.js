import Ember from 'ember';
import chrono from 'npm:chrono-node';

import deduplicateVisitorSuggestions from 'prison-rideshare-ui/utils/deduplicate-visitor-suggestions';

export default Ember.Component.extend({
  institutionsService: Ember.inject.service('institutions'),
  institutions: Ember.computed.alias('institutionsService.all'),
  store: Ember.inject.service('store'),

  warning: Ember.computed('ride.cancellationReason', 'ride.complete', function() {
    const reason = this.get('ride.cancellationReason');
    const complete = this.get('ride.complete');

    if (reason) {
      return 'You are editing a cancelled ride!';
    } else if (complete) {
      return 'You are editing a ride that has already had its report completed!';
    } else {
      return false;
    }
  }),

  actions: {
    timespanUpdated(value) {
      this.set('ride.timespan', value);

      const [parsed] = chrono.parse(value);

      if (parsed) {
        if (parsed.start) {
          this.set('ride.start', parsed.start.date());
        }

        if (parsed.end) {
          this.set('ride.end', parsed.end.date());
        }
      }
    },

    searchRides(name) {
      return this.get('store').query('ride', {'filter[name]': name}).then(rides => {
        return deduplicateVisitorSuggestions(rides);
      });
    },

    autocompleteSelectionChanged(ride) {
      if (ride) {
        this.set('ride.name', ride.get('name'));
        this.set('ride.address', ride.get('address'));
        this.set('ride.contact', ride.get('contact'));
      }
    },

    matchInstitution(option, searchTerm) {
      const name = Ember.get(option, 'name');
      const result = (name || '').toLowerCase().startsWith(searchTerm.toLowerCase());

      return result ? 1 : -1;
    }
  }
});

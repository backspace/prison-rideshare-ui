import { computed, get } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

import parseTimespan from 'prison-rideshare-ui/utils/parse-timespan';
import deduplicateVisitorSuggestions from 'prison-rideshare-ui/utils/deduplicate-visitor-suggestions';

export default Component.extend({
  institutionsService: service('institutions'),
  institutions: alias('institutionsService.all'),
  store: service('store'),

  warning: computed('ride.cancellationReason', 'ride.complete', function() {
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
      const parsed = parseTimespan(value);

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
      const name = get(option, 'name');
      const result = (name || '').toLowerCase().startsWith(searchTerm.toLowerCase());

      return result ? 1 : -1;
    }
  }
});

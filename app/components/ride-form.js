import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

import formatTimespan from 'prison-rideshare-ui/utils/format-timespan';

import parseTimespan from 'prison-rideshare-ui/utils/parse-timespan';
import deduplicateVisitorSuggestions from 'prison-rideshare-ui/utils/deduplicate-visitor-suggestions';

export default Component.extend({
  institutionsService: service('institutions'),
  institutions: alias('institutionsService.all'),
  store: service('store'),

  warning: computed('ride.{cancellationReason,complete}', function() {
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

  rideTimes: computed('ride.{start,end}', function() {
    if (this.get('ride.start') && this.get('ride.end')) {
      const start = this.get('ride.start');
      const end = this.get('ride.end');

      return formatTimespan(start, end);
    } else {
      return undefined;
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
      return this.get('store')
        .query('ride', { 'filter[name]': name })
        .then(rides => {
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
  },
});

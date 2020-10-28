import { computed } from '@ember/object';
import { alias, oneWay } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { isPresent } from '@ember/utils';
import Component from '@ember/component';

import formatTimespan from 'prison-rideshare-ui/utils/format-timespan';

import parseTimespan from 'prison-rideshare-ui/utils/parse-timespan';
import deduplicateVisitorSuggestions from 'prison-rideshare-ui/utils/deduplicate-visitor-suggestions';

export default Component.extend({
  institutionsService: service('institutions'),
  institutions: alias('institutionsService.all'),
  store: service('store'),

  visitorSearchText: oneWay('ride.visitor.name'),

  editingWarning: computed('ride.{cancellationReason,complete}', function() {
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

  timespanWarning: computed('ride.{start,end}', function() {
    const start = this.get('ride.start');
    const end = this.get('ride.end');

    return start && end && start < new Date();
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

    searchVisitors() {
      if (isPresent(this.searchText)) {
        return this.get('store')
          .query('ride', { 'filter[visitor]': this.searchText })
          .then(rides => {
            return rides;
          })
          .catch(err => {
            // FIXME what to do
            // eslint-disable-next-line no-console
            console.log('error???', err);
          });
      }
    },

    clearVisitor() {
      this.set('ride.visitor', undefined);
    },

    autocompleteSelectionChanged(ride) {
      if (ride) {
        this.set('ride.visitor', ride.get('visitor'));
        this.set('ride.address', ride.get('address'));
        this.set('ride.contact', ride.get('contact'));
      }
    },
  },
});

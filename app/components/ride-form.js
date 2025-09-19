/* eslint-disable ember/no-actions-hash, ember/no-classic-classes, ember/no-classic-components, ember/no-get, ember/require-tagless-components */
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import moment from 'moment';

import formatTimespan from 'prison-rideshare-ui/utils/format-timespan';

import parseTimespan from 'prison-rideshare-ui/utils/parse-timespan';
import deduplicateVisitorSuggestions from 'prison-rideshare-ui/utils/deduplicate-visitor-suggestions';

const DATETIME_LOCAL_FORMAT = 'YYYY-MM-DDTHH:mm';

export default Component.extend({
  institutionsService: service('institutions'),
  institutions: alias('institutionsService.all'),
  moment: service(),
  store: service('store'),

  overrideTimespan: false,

  editingWarning: computed('ride.{cancellationReason,complete}', function () {
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

  timespanWarning: computed('ride.{start,end}', function () {
    const start = this.get('ride.start');
    const end = this.get('ride.end');

    return start && end && start < new Date();
  }),

  rideTimes: computed('ride.{start,end}', function () {
    if (this.get('ride.start') && this.get('ride.end')) {
      const start = this.get('ride.start');
      const end = this.get('ride.end');

      return formatTimespan(this.moment, start, end);
    } else {
      return undefined;
    }
  }),

  startTimeString: computed('ride.start', function () {
    return moment(this.get('ride.start')).format(DATETIME_LOCAL_FORMAT);
  }),

  endTimeString: computed('ride.end', function () {
    return moment(this.get('ride.end')).format(DATETIME_LOCAL_FORMAT);
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
      return this.store
        .query('ride', { 'filter[name]': name })
        .then((rides) => {
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

    updateStartTime(value) {
      this.set(
        'ride.start',
        new Date(moment(value, DATETIME_LOCAL_FORMAT).valueOf())
      );
    },

    updateEndTime(value) {
      this.set(
        'ride.end',
        new Date(moment(value, DATETIME_LOCAL_FORMAT).valueOf())
      );
    },
  },
});

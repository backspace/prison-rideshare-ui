import classic from 'ember-classic-decorator';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';
import Component from '@ember/component';
import moment from 'moment';

import formatTimespan from 'prison-rideshare-ui/utils/format-timespan';

import parseTimespan from 'prison-rideshare-ui/utils/parse-timespan';
import deduplicateVisitorSuggestions from 'prison-rideshare-ui/utils/deduplicate-visitor-suggestions';

const DATETIME_LOCAL_FORMAT = 'YYYY-MM-DDTHH:mm';

@classic
export default class RideForm extends Component {
  @service('institutions')
  institutionsService;

  @alias('institutionsService.all')
  institutions;

  @service
  moment;

  @service('store')
  store;

  overrideTimespan = false;

  @computed('ride.{cancellationReason,complete}')
  get editingWarning() {
    const reason = this.get('ride.cancellationReason');
    const complete = this.get('ride.complete');

    if (reason) {
      return 'You are editing a cancelled ride!';
    } else if (complete) {
      return 'You are editing a ride that has already had its report completed!';
    } else {
      return false;
    }
  }

  @computed('ride.{start,end}')
  get timespanWarning() {
    const start = this.get('ride.start');
    const end = this.get('ride.end');

    return start && end && start < new Date();
  }

  @computed('ride.{start,end}')
  get rideTimes() {
    if (this.get('ride.start') && this.get('ride.end')) {
      const start = this.get('ride.start');
      const end = this.get('ride.end');

      return formatTimespan(this.moment, start, end);
    } else {
      return undefined;
    }
  }

  @computed('ride.start')
  get startTimeString() {
    return moment(this.get('ride.start')).format(DATETIME_LOCAL_FORMAT);
  }

  @computed('ride.end')
  get endTimeString() {
    return moment(this.get('ride.end')).format(DATETIME_LOCAL_FORMAT);
  }

  @action
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
  }

  @action
  searchRides(name) {
    return this.store
      .query('ride', { 'filter[name]': name })
      .then((rides) => {
        return deduplicateVisitorSuggestions(rides);
      });
  }

  @action
  autocompleteSelectionChanged(ride) {
    if (ride) {
      this.set('ride.name', ride.get('name'));
      this.set('ride.address', ride.get('address'));
      this.set('ride.contact', ride.get('contact'));
    }
  }

  @action
  updateStartTime(value) {
    this.set(
      'ride.start',
      new Date(moment(value, DATETIME_LOCAL_FORMAT).valueOf())
    );
  }

  @action
  updateEndTime(value) {
    this.set(
      'ride.end',
      new Date(moment(value, DATETIME_LOCAL_FORMAT).valueOf())
    );
  }
}

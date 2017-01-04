import Ember from 'ember';
import moment from 'moment';

export function rideTimes([ride]) {
  const start = ride.get('start');
  const end = ride.get('end');

  return `${moment(start).format('ddd MMM D h:mma')} — ${moment(end).format('h:mm')}`;
}

export default Ember.Helper.helper(rideTimes);

// {{moment-format ride.start 'YYYY-MM-DD'}} {{moment-format ride.start 'h:mma'}} — {{moment-format ride.end 'h:mm'}}

// ddd, MMM D [at] h:mma

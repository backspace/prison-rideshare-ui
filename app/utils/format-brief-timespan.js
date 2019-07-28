import moment from 'moment';

function isAnteMeridiem(time) {
  return time.getHours() < 12;
}

// FIXME this is duplicated in format-timespan
moment.updateLocale('en', {
  meridiem(hours, minutes, isLower) {
    // Taken from https://github.com/moment/moment/blob/7785323888893428f08eb6d5dc5eb266d5bf2a11/src/lib/units/hour.js#L130
    if (hours > 11) {
      return isLower ? 'p' : 'P';
    } else {
      return isLower ? 'a' : 'A';
    }
  },
});

export default function formatTimespan(start, end) {
  let startTime, endTime;

  if (start && start.getMinutes() === 0) {
    startTime = 'ha';
  } else {
    startTime = 'h:mma';
  }

  if (end && end.getMinutes() === 0) {
    endTime = 'h';
  } else {
    endTime = 'h:mm';
  }

  if (!start || !end || isAnteMeridiem(start) !== isAnteMeridiem(end)) {
    endTime += 'a';
  }

  return `${moment(start).format(startTime)}—${moment(end).format(endTime)}`;
}

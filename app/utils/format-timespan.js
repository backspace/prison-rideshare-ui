import moment from 'moment';

moment.updateLocale('en', {
  meridiem(hours, minutes, isLower) {
    // Taken from https://github.com/moment/moment/blob/7785323888893428f08eb6d5dc5eb266d5bf2a11/src/lib/units/hour.js#L130
    if (hours > 11) {
      return isLower ? 'p' : 'P';
    } else {
      return isLower ? 'a' : 'A';
    }
  }
});

function isAnteMeridiem(time) {
  return time.getHours() < 12;
}

export default function formatTimespan(start, end, date = true) {
  let startDate, startTime, endTime;

  if (start && new Date().getFullYear() == start.getFullYear()) {
    startDate = 'ddd MMM D'
  } else {
    startDate = 'ddd MMM D YYYY';
  }

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

  return `${date ? `${moment(start).format(startDate)} ` : ''}${moment(start).format(startTime)} — ${moment(end).format(endTime)}`;
}

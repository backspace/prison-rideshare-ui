function isAnteMeridiem(time) {
  return time.getHours() < 12;
}

export default function formatTimespan(moment, start, end, date = true) {
  let startDate, startTime, endTime;

  if (start && new Date().getFullYear() == start.getFullYear()) {
    startDate = 'ddd MMM D';
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

  let startDateString = moment.moment(start).format('YYYY-MM-DD');
  let endDateString = moment.moment(end).format('YYYY-MM-DD');

  if (startDateString !== endDateString) {
    endTime = `ddd ${endTime}`;
  }

  return `${date ? `${moment.moment(start).format(startDate)} ` : ''}${moment
    .moment(start)
    .format(startTime)} — ${moment.moment(end).format(endTime)}`;
}

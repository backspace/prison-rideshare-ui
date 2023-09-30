function isAnteMeridiem(time) {
  return time.getHours() < 12;
}

export default function formatBriefTimespan(moment, start, end) {
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

  return `${moment.moment(start).format(startTime)}—${moment
    .moment(end)
    .format(endTime)}`;
}

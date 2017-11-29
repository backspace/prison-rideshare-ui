import chrono from 'npm:chrono-node';

const assumeEndDay = new chrono.Refiner();
assumeEndDay.refine = function(text, results) {
  results.forEach(({start, end}) => {
    if (!end.isCertain('meridiem') && start.isCertain('meridiem') && start.get('meridiem') === 1) {
      end.assign('meridiem', 1);
      end.assign('year', start.get('year'));
      end.assign('month', start.get('month'));
      end.assign('day', start.get('day'));
      end.assign('hour', end.get('hour') + 12);
    }
  });

  return results;
}

const assumePM = new chrono.Refiner();
assumePM.refine = function(text, results) {
  results.forEach(({start, end}) => {
    if (!start.isCertain('meridiem')) {
      start.assign('meridiem', 1);
      start.assign('hour', start.get('hour') + 12);

      end.assign('meridiam', 1);
      end.assign('hour', end.get('hour') + 12);
    }
  });

  return results;
}

const chronoInstance = new chrono.Chrono();
chronoInstance.refiners.push(assumeEndDay);
chronoInstance.refiners.push(assumePM);

export default function parseTimespan(value) {
  const [parsed] = chronoInstance.parse(value, new Date(), {forwardDatesOnly: true});
  return parsed;
}

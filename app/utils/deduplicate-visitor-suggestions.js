import { get } from '@ember/object';

const SUGGESTION_COUNT = 3;

export default function deduplicateVisitorSuggestions(rides) {
  const deduplicatedRides = rides.reduce((deduplicated, ride) => {
    if (deduplicated.every(chosenRide => ridesAreDissimilar(chosenRide, ride))) {
      deduplicated.push(ride);
    }

    return deduplicated;
  }, []);

  deduplicatedRides.splice(SUGGESTION_COUNT);

  return deduplicatedRides;
}

function ridesAreDissimilar(a, b) {
  return get(a, 'name').toLowerCase() !== get(b, 'name').toLowerCase() ||
    get(a, 'address').toLowerCase() !== get(b, 'address').toLowerCase() ||
    get(a, 'contact').toLowerCase() !== get(b, 'contact').toLowerCase();
}

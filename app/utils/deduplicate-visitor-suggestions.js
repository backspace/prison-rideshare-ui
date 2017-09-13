import Ember from 'ember';

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
  return Ember.get(a, 'name').toLowerCase() !== Ember.get(b, 'name').toLowerCase() ||
    Ember.get(a, 'address').toLowerCase() !== Ember.get(b, 'address').toLowerCase() ||
    Ember.get(a, 'contact').toLowerCase() !== Ember.get(b, 'contact').toLowerCase();
}

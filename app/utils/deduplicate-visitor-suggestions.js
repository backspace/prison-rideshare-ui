import Ember from 'ember';

export default function deduplicateVisitorSuggestions(rides) {
  return rides.reduce((deduplicated, ride) => {
    if (deduplicated.every(chosenRide => ridesAreDissimilar(chosenRide, ride))) {
      deduplicated.push(ride);
    }

    return deduplicated;
  }, []);
}

function ridesAreDissimilar(a, b) {
  return Ember.get(a, 'name').toLowerCase() !== Ember.get(b, 'name').toLowerCase() ||
    Ember.get(a, 'address').toLowerCase() !== Ember.get(b, 'address').toLowerCase() ||
    Ember.get(a, 'contact').toLowerCase() !== Ember.get(b, 'contact').toLowerCase();
}

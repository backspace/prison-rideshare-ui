const SUGGESTION_COUNT = 3;

export default function deduplicateVisitorSuggestions(rides) {
  const deduplicatedRides = rides.reduce((deduplicated, ride) => {
    if (
      deduplicated.every((chosenRide) => ridesAreDissimilar(chosenRide, ride))
    ) {
      deduplicated.push(ride);
    }

    return deduplicated;
  }, []);

  deduplicatedRides.splice(SUGGESTION_COUNT);

  return deduplicatedRides;
}

function ridesAreDissimilar(a, b) {
  return (
    visitorName(a).toLowerCase() !== visitorName(b).toLowerCase() ||
    (a.address || '').toLowerCase() !== (b.address || '').toLowerCase() ||
    (a.contact || '').toLowerCase() !== (b.contact || '').toLowerCase()
  );
}

function visitorName(ride) {
  return ride.visitorName || ride.name || '';
}

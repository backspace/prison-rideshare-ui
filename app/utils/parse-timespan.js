import chrono from 'npm:chrono-node';

export default function parseTimespan(value) {
  const [parsed] = chrono.parse(value, new Date(), {forwardDatesOnly: true});
  return parsed;
}

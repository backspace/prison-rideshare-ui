export default function stringToMobiledoc(string) {
  return JSON.stringify({
    version: '0.3.2',
    atoms: [],
    cards: [],
    markups: [],
    sections: [[1, 'p', [[0, [], 0, string]]]],
  });
}

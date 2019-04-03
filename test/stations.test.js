import findStationSuggestions from '../src/stations.js';

test('does not return suggestions if query is empty', () => {
  expect(findStationSuggestions(null)).toEqual([]);
  expect(findStationSuggestions("")).toEqual([]);
});

test('finds suggestions starting with query', () => {
  let suggestions = findStationSuggestions('let').map(station => station.name);
  expect(suggestions).toEqual(expect.arrayContaining(['Letchworth Garden City']));
  expect(suggestions).not.toEqual(expect.arrayContaining(['Bletchley']));
});

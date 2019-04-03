import stations from '../src/stations.js';

test('stations is a collection', () => {
  expect(stations).toEqual(expect.arrayContaining([{name: 'Letchworth Garden City', code: 'LET'}]));
});

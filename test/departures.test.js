import { findDepartures, mapDeparture } from '../src/departures';

const departure = { 
  mode: 'train',
  service: '22726100',
  train_uid: 'G15791',
  platform: '2',
  operator: 'TL',
  operator_name: 'Thameslink',
  aimed_departure_time: '12:49',
  aimed_arrival_time: '12:49',
  aimed_pass_time: null,
  origin_name: 'London Kings Cross',
  destination_name: 'Cambridge North',
  source: 'Network Rail',
  category: 'OO',
  service_timetable: {
    id: 'https://transportapi.com/v3/uk/train/service/train_uid:G15791/2019-04-04/timetable.json?app_id=8848d21b&app_key=048eae2fe76eaf94472e7f3664860d07&live=true'
  },
  status: 'LATE',
  expected_arrival_time: '12:49',
  expected_departure_time: '12:50',
  best_arrival_estimate_mins: 2,
  best_departure_estimate_mins: 2,
  station_detail: {
    calling_at: [],
    destination: {
      station_name: 'Cambridge North',
      platform: '3',
      station_code: 'CMB',
      tiploc_code: 'CAMBNTH',
      aimed_arrival_time: '13:28',
      aimed_departure_time: null,
      aimed_pass_time: null
    } 
  } 
};

test('findDepartures retuns departures from a station', () => {
  fetch.mockResponseOnce(JSON.stringify({ departures: { all: [ departure ] } }));
  return findDepartures({ from: 'LET' }).then(departures => {
    expect(departures.length).toBe(1);
    expect(departures[0].destination).toBe('Cambridge North');
  });
});

test('mapDeparture converts API response into object', () => {
  let result = mapDeparture(departure);
  expect(result.destination).toBe('Cambridge North');
  expect(result.departureTime).toBe('12:50');
  expect(result.originalDepartureTime).toBe('12:49');
  expect(result.arrivalTime).toBe('13:28');
  expect(result.platform).toBe('2');
  expect(result.status).toBe('LATE');
  expect(result.showTag).toBe(true);
  expect(result.danger).toBe(false);
  expect(result.warning).toBe(true);
});

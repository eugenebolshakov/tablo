import 'cross-fetch/polyfill';

const apiUrl = `${API_URL}/v3/uk/train/station`;

const knownStatuses = ['ON TIME', 'STARTS HERE', 'CHANGE OF ORIGIN', 'EARLY', 'NO REPORT', 'OFF ROUTE'];
const dangerStatuses = ['DELAYED', 'CANCELLED'];
const warningStatuses = ['LATE', 'BUS'];

export function mapDeparture(departure) {
  return {
    destination: departure["destination_name"],
    departureTime: departure["expected_departure_time"],
    originalDepartureTime: departure["aimed_departure_time"],
    arrivalTime: (departure["station_detail"]["calling_at"][0] || departure["station_detail"]["destination"])["aimed_arrival_time"],
    platform: departure["platform"],
    status: departure["status"],
    showTag: !knownStatuses.includes(departure["status"]),
    danger: dangerStatuses.includes(departure["status"]),
    warning: warningStatuses.includes(departure["status"])
  };
};

export function findDepartures(query) {
  if (!query.from) { return []; }

  let url = `${apiUrl}/${query.from}/live.json?&calling_at=${query.to || ""}&darwin=false&train_status=passenger&from_offset=PT00:00:00&station_detail=calling_at,destination`;

  return fetch(url).then(response => response.json().then(json => {
    return json["departures"]["all"].map(departure => mapDeparture(departure))
  }));
};

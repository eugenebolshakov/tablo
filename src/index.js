import './index.scss';

import Vue from 'vue';

var form = new Vue({
  el: '#app',
	data: {
    departureStationCode: null,
    arrivalStationCode: null,
    departures: []
	},
	methods: {
		findDepartures: function() {
      const appId = "8848d21b";
      const appKey = "048eae2fe76eaf94472e7f3664860d07";
      const apiUrl = "https://transportapi.com/v3/uk/train/station";

      if (!this.departureStationCode) {
        return;
      }

      let url = `${apiUrl}/${this.departureStationCode}/live.json?app_id=${appId}&app_key=${appKey}&calling_at=${this.arrivalStationCode || ""}&darwin=false&train_status=passenger&from_offset=PT00:00:00&station_detail=calling_at,destination`;

      fetch(url).then((response) => {
        response.json().then((json) => {
          this.departures = json["departures"]["all"].map((departure) => {
            return {
              destination: departure["destination_name"],
              departure_time: departure["expected_departure_time"],
              arrival_time: (departure["station_detail"]["calling_at"][0] || departure["station_detail"]["destination"])["aimed_arrival_time"],
              platform: departure["platform"]
            };
          });
        });
      });
		}
	}	
});

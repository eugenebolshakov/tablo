import './index.scss';

import stations from './stations.js';
import Vue from 'vue';

Vue.component('station-selector', {
  props: ['label'],
  data: () => ({ code: null, name: null, suggestions: [] }),
  template: `
    <div class="field">
      <label class="label">{{ label }}</label>
      <div class="control">
        <input class="input" type="text" v-bind:placeholder="label" v-bind:value="name" v-on:input="name = $event.target.value; showSuggestions()">
      </div>
      <div class="dropdown is-active" v-if="suggestions.length > 0">
        <div class="dropdown-menu">
          <div class="dropdown-content">
            <a href="#" class="dropdown-item" v-for="suggestion in suggestions" v-on:click.prevent="selectSuggestion(suggestion)">{{ suggestion.name }}</a>
          </div>
        </div>
      </div>
    </div>
  `,
  methods: {
    showSuggestions: function() {
      if (this.name.length) {
        let regExp = new RegExp(`^${this.name.toLowerCase()}`, 'i');
        this.suggestions = stations.filter(station => station.name.match(regExp));
      } else {
        this.suggestions = [];
      }
    },

    selectSuggestion: function(suggestion) {
      this.name = suggestion.name;
      this.code = suggestion.code;
      this.suggestions = [];
      this.$emit('input', this.code);
    }
  }
});

const knownStatuses = ['ON TIME', 'STARTS HERE', 'CHANGE OF ORIGIN', 'EARLY', 'NO REPORT'];
const dangerStatuses = ['DELAYED', 'CANCELLED'];
const warningStatuses = ['LATE', 'BUS'];

var form = new Vue({
  el: '#app',
	data: {
    departureStationCode: null,
    arrivalStationCode: null,
    loading: false,
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

      this.loading = true;

      let url = `${apiUrl}/${this.departureStationCode}/live.json?app_id=${appId}&app_key=${appKey}&calling_at=${this.arrivalStationCode || ""}&darwin=false&train_status=passenger&from_offset=PT00:00:00&station_detail=calling_at,destination`;

      fetch(url).then(response => {
        response.json().then(json => {
          this.departures = json["departures"]["all"].map(departure => (
            {
              destination: departure["destination_name"],
              departure_time: departure["expected_departure_time"],
              original_departure_time: departure["aimed_departure_time"],
              arrival_time: (departure["station_detail"]["calling_at"][0] || departure["station_detail"]["destination"])["aimed_arrival_time"],
              platform: departure["platform"],
              status: departure["status"],
              show_tag: !knownStatuses.includes(departure["status"]),
              danger: dangerStatuses.includes(departure["status"]),
              warning: warningStatuses.includes(departure["status"])
            }
          ));
          
          this.loading = false;
        });
      });
		}
	}	
});

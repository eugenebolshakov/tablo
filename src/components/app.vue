<template>
  <div>
    <section class="section">
      <div class="container">
        <fieldset>
          <station-selector label="From" v-bind:code="departureStationCode" v-on:input="departureStationCode = $event; findDepartures()"></station-selector>
          <station-selector label="To" v-bind:code="arrivalStationCode" v-on:input="arrivalStationCode = $event; findDepartures()"></station-selector>
          <div class="field">
            <div class="control">
              <button class="button" v-on:click="findDepartures" v-bind:class="{ 'is-loading': loading }">Show</button>
            </div>
          </div>
        </fieldset>
      </div>
    </section>
    <section class="section" v-if="departures.length > 0">
      <div class="container">
        <table class="table is-fullwidth">
          <thead>
            <tr>
              <th>Destination</th>
              <th class="has-text-centered"><abbr title="Departure">Dep</abbr></th>
              <th class="has-text-centered"><abbr title="Arrival">Arr</abbr></th>
              <th class="has-text-centered"><abbr title="Platform">Plat</abbr></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="departure in departures">
              <td>
                {{ departure.destination }}
                <span class="tag" v-if="departure.show_tag" v-bind:class="{ 'is-warning': departure.warning, 'is-danger': departure.danger }">{{ departure.status }}</span>
              </td>
              <td class="has-text-centered">
                {{ departure.departure_time }}
                <span class="tag is-white is-strikethrough" v-if="departure.departure_time != departure.original_departure_time">
                  {{ departure.original_departure_time }}
                </span>
              </td>
              <td class="has-text-centered">{{ departure.arrival_time }}</td>
              <td class="has-text-centered">{{ departure.platform }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script>
import StationSelector from './station_selector.vue';

const knownStatuses = ['ON TIME', 'STARTS HERE', 'CHANGE OF ORIGIN', 'EARLY', 'NO REPORT', 'OFF ROUTE'];
const dangerStatuses = ['DELAYED', 'CANCELLED'];
const warningStatuses = ['LATE', 'BUS'];

export default {
	data: () => ({
    departureStationCode: null,
    arrivalStationCode: null,
    loading: false,
    departures: []
	}),
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
	},
  components: { StationSelector }
}
</script>

<style lang="scss">
$section-padding: 1rem;

@import "~bulma/bulma";

.is-strikethrough {
  text-decoration: line-through;
}
</style>

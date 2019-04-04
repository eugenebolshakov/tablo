<template>
  <div>
    <section class="section">
      <div class="container">
        <fieldset>
          <station-selector ref="departureStation" label="From" v-bind:code="departureStationCode" v-on:input="departureStationCode = $event; findDepartures()"></station-selector>
          <station-selector ref="arrivalStation" label="To" v-bind:code="arrivalStationCode" v-on:input="arrivalStationCode = $event; findDepartures()"></station-selector>
          <div class="field">
            <div class="control">
              <button class="button" v-on:click="findDepartures" v-bind:class="{ 'is-loading': loading }">Show</button>
            </div>
          </div>
        </fieldset>
      </div>
    </section>
    <section class="section departures" v-if="departures.length > 0">
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
                <span class="tag" v-if="departure.showTag" v-bind:class="{ 'is-warning': departure.warning, 'is-danger': departure.danger }">{{ departure.status }}</span>
              </td>
              <td class="has-text-centered">
                {{ departure.departureTime }}
                <span class="tag is-white is-strikethrough" v-if="departure.departureTime != departure.originalDepartureTime">
                  {{ departure.originalDepartureTime }}
                </span>
              </td>
              <td class="has-text-centered">{{ departure.arrivalTime }}</td>
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
import { findDepartures } from '../departures';

export default {
	data: () => ({
    departureStationCode: null,
    arrivalStationCode: null,
    loading: false,
    departures: []
	}),
	methods: {
		findDepartures: function() {
      this.loading = true;
      findDepartures({ from: this.departureStationCode, to: this.arrivalStationCode })
        .then(departures => {
          this.departures = departures;
          this.loading = false
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

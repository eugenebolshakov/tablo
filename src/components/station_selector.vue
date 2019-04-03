<template>
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
</template>

<script>
import findStationSuggestions from '../stations.js';

export default {
  props: ['label'],
  data: () => ({ code: null, name: null, suggestions: [] }),
  methods: {
    showSuggestions: function() {
      this.suggestions = findStationSuggestions(this.name);
    },

    selectSuggestion: function(suggestion) {
      this.name = suggestion.name;
      this.code = suggestion.code;
      this.suggestions = [];
      this.$emit('input', this.code);
    }
  }
}
</script>

<template>
  <b-card no-body>
    <!-- chart -->
    <b-card-body>
      <chartjs-component-bar-chart
        v-if="data.labels.length !== 0"
        :height="300"
        :chartdata="data"
        :options="options"
      />
    </b-card-body>
    <b-card-footer>
      <b-card-title>{{ title }}</b-card-title>
    </b-card-footer>
  </b-card>
</template>

<script>
/* eslint-disable */
import { BCard, BCardBody, BCardTitle, BCardFooter } from "bootstrap-vue";
import ChartjsComponentBarChart from "./charts-components/ChartjsComponentBarChart.vue";

export default {
  components: {
    BCard,
    BCardFooter,
    BCardBody,
    BCardTitle,
    ChartjsComponentBarChart,
  },
  props: ["title", "data", "options"],
  data() {
    return {};
  },
};
</script>

<style lang="scss">
@import "@core/scss/vue/libs/vue-flatpicker.scss";
</style>

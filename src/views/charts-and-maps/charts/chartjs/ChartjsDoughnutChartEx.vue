<template>
  <b-card no-body>
    <!-- chart -->
    <b-card-body>
      <chartjs-component-doughnut-chart
        v-if="data.datasets[0].labels.length !== 0"
        :height="275"
        :data="data"
        :options="chartjsData.doughnutChart.options"
        class="mb-3"
      />
    </b-card-body>
    <!--/ chart -->
    <b-card-footer>
      <b-card-title>{{ title }}</b-card-title>
    </b-card-footer>
  </b-card>
</template>

<script>
/* eslint-disable */
import { BCard, BCardFooter, BCardTitle, BCardBody } from "bootstrap-vue";
import ChartjsComponentDoughnutChart from "./charts-components/ChartjsComponentDoughnutChart.vue";
import chartjsData from "./chartjsData";

export default {
  components: {
    ChartjsComponentDoughnutChart,
    BCard,
    BCardBody,
    BCardFooter,
    BCardTitle,
  },
  props: ["title", "data"],
  data() {
    return {
      chartjsData,
    };
  },
};
</script>

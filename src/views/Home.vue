<template>
  <b-row class="match-height">
    <b-col md="4">
      <chartjs-bar-chart-ex title="Activity by day" :data="actData" :options="actOptions"/>
    </b-col>
    <b-col md="4">
      <chartjs-bar-chart-ex title="Links by day" :data="linkData" :options="linkOptions"/>
    </b-col>
    <b-col md="4">
      <chartjs-doughnut-chart-ex
        title="Activity by link"
        :data="doughnutData"
      />
    </b-col>
    <b-col cols="12">
      <table-basic-ex :items="items" :title="title" />
    </b-col>
  </b-row>
</template>

<script>
/* eslint-disable */
import { $themeColors } from "@themeConfig";
import { BRow, BCol } from "bootstrap-vue";

import TableBasicEx from "./table/bs-table/TableBasicEx.vue";
import ChartjsBarChartEx from "./charts-and-maps/charts/chartjs/ChartjsBarChartEx.vue";
import ChartjsDoughnutChartEx from "./charts-and-maps/charts/chartjs/ChartjsDoughnutChartEx.vue";
import chartjsData from "./charts-and-maps/charts/chartjs/chartjsData";

export default {
  components: {
    BRow,
    BCol,

    ChartjsBarChartEx,
    ChartjsDoughnutChartEx,

    TableBasicEx,
  },
  data() {
    return {
      title: "Last Activity",
      fields: ["date", "hour", "caseName", "linkName"],
      items: [],
      linkOptions: chartjsData.latestBarChart.options,
      actOptions: chartjsData.latestBarChart.options,
      actData: {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: "#28dac6",
            borderColor: "transparent",
          },
        ],
      },
      linkData: {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: "#28dac6",
            borderColor: "transparent",
          },
        ],
      },
      doughnutData: {
        datasets: [
          {
            labels: [],
            data: [],
            backgroundColor: ["#28dac6", "#FDAC34", $themeColors.primary],
            borderWidth: 0,
            pointStyle: "rectRounded",
          },
          {
            data: [],
          },
        ],
      },
    };
  },
  methods: {
    getLabelsAndData(res) {
      const labels = [],
        data = [];

      for (const key in res.data[0]) {
        if (res.data[0].hasOwnProperty(key)) {
          labels.push(key);
          data.push(res.data[0][key]);
        }
      }

      return { labels, data };
    },
  },
  created() {
    this.$http.get("/api/linkaccess/accessforamonth/").then((res) => {
      const { labels, data } = this.getLabelsAndData(res);
      const max = Math.ceil(Math.max(...data) * 1.1);

      this.actData.labels = labels;
      this.actData.datasets[0].data = data;
      this.actOptions.scales.yAxes[0].ticks.max = max;
      this.actOptions.scales.yAxes[0].ticks.stepSize = max;
    });

    this.$http.get("/api/linkaccess/linkforamonth/").then((res) => {
      const { labels, data } = this.getLabelsAndData(res);
      const max = Math.ceil(Math.max(...data) * 1.1);

      this.linkData.labels = labels;
      this.linkData.datasets[0].data = data;

      this.linkOptions.scales.yAxes[0].ticks.max = max;
      this.linkOptions.scales.yAxes[0].ticks.stepSize = max;
      
    });

    this.$http.get("/api/linkaccess/accessperlink/").then((res) => {
      const labels = res.data.map((item) => item.name);
      const data = res.data.map((item) => item.count);
      const ids = res.data.map((item) => item.id);

      this.doughnutData.datasets[0].labels = labels;
      this.doughnutData.datasets[0].data = data;
      this.doughnutData.datasets[0].ids = ids;
      // this.doughnutData.datasets[1].data = ids;
    });

    this.$http.get("/api/linkaccess/lastaccesses/").then((res) => {
      this.items = res.data.reverse().map((item) => {
        return {
          date: item.timestamp.split('T')[0],
          hour: item.timestamp.split('T')[1].split('.')[0],
          caseName: item.case,
          linkName: { name: item.name, id: item.link_id },
        };
      });
    });
  },
};
</script>

<style>
</style>

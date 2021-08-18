<template>
  <b-row class="match-height">
    <b-col cols="8">
      <b-card no-body>
        <div class="card-header">
          <b-card-title>IP ({{ addr }})</b-card-title>
        </div>
        <b-table
          striped
          responsive
          :items="data"
          class="mb-0"
          thead-class="hidden"
        >
          <template #cell(field)="data">
            {{ data.value }}
          </template>
          <template #cell(action)="data">
            <b-button
              v-if="data.value === true"
              v-ripple.400="'rgba(113, 102, 240, 0.15)'"
              variant="flat-primary"
            >
              Edit
            </b-button>
          </template>
        </b-table>
      </b-card>
    </b-col>
    <b-col cols="4">
      <!-- Todo List -->
      <chartjs-bar-chart-ex title="Activity by day" :data="actData" />
    </b-col>
    <b-col cols="12">
      <good-table-basic-ex
        :columns="columns"
        :rows="rows"
        :title="title"
        :onAction="onAction"
        :filter="true"
        :pageNum="curPage"
      />
    </b-col>
  </b-row>
</template>

<script>
/* eslint-disable */
import { BRow, BCol, BTable, BCard, BButton, BCardTitle } from "bootstrap-vue";
import router from "@/router";
import Ripple from "vue-ripple-directive";

import GoodTableBasicEx from "./table/vue-good-table/GoodTableBasicEx.vue";
import ChartjsBarChartEx from "./charts-and-maps/charts/chartjs/ChartjsBarChartEx.vue";
import getLabelsAndData from "./util.js";

export default {
  components: {
    BRow,
    BCol,
    BTable,
    BCard,
    BCardTitle,
    BButton,

    GoodTableBasicEx,
    ChartjsBarChartEx,
  },
  directives: {
    Ripple,
  },
  setup() {
    const addr = router.currentRoute.params.addr;

    return {
      addr,
    };
  },
  methods: {
    onAction(action, value) {
      switch (action) {
        case "UpdatePerPage":
          this.pageLength = value;
          this.loading = true;
          this.loadData();
          break;
        case "UpdatePage":
          this.curPage = value;
          this.loading = true;
          this.loadData();
          break;
        case "UpdateRelevant":
          const formData = new FormData();

          for (let index = 0; index < this.rows.length; index++) {
            if (this.rows[index].id === value.id) {
              this.rows[index].relevant = !value.relevant;
              break;
            }
          }
          formData.append(
            "relevant",
            value.relevant === true ? "False" : "True"
          );
          this.$http.put(`/api/linkaccess/${value.id}/`, formData);
          break;
        case "UpdateFilter":
          this.filtered = value;
          this.count = 0;
          this.curPage = 1;
          this.loadData();
          break;
      }
    },
    loadData() {
      const relevantQuery = this.filtered ? `&relevant=true` : "";

      console.log(`api/ipaccess/count/?host=${this.addr}${relevantQuery}`);
      this.$http
        .get(`api/ipaccess/count/?host=${this.addr}${relevantQuery}`)
        .then((res) => {
          this.count = res.data;
          this.curPage = Math.min(
            Math.ceil(this.count / this.pageLength), this.curPage
          );

          console.log("---------DEBUG----------", res.data, this.curPage)
          if(Number(res.data) === 0) {
            this.curPage = 1;
            this.rows = [];
            return;
          }

          this.$http
            .get(
              `api/ipaccess/?host=${this.addr}&p=${this.curPage}&page_size=${this.pageLength}${relevantQuery}`
            )
            .then((res) => {
              const rows = Array(Number(this.count)).fill({});
              const result = res.data.map((item) => {
                return {
                  id: item.id,
                  date: item.timestamp ? item.timestamp.split(".")[0] : "",
                  caseName: item.case,
                  link: { name: item.name, id: item.link_id },
                  url: item.url,
                  referrer: item.referrer,
                  userAgent: item.agent,
                  relevant: item.relevant === null ? false : item.relevant,
                };
              });
              const startIndex =
                Number(this.pageLength) * (Number(this.curPage) - 1);

              for (
                let index = startIndex;
                index < startIndex + Number(this.pageLength) &&
                index < this.count;
                index++
              ) {
                rows[index] = result[index - startIndex];
              }

              console.log("rows", this.count, rows);

              this.rows = rows;
              this.loading = false;
            });
        });
    },
  },
  data() {
    return {
      title: "Activity",
      data: [
        {
          field: "IP",
          value: this.addr,
          action: false,
        },
        {
          field: "Type",
          value: "dynamic",
          action: false,
        },
        {
          field: "Provider",
          value: "Movistar",
          action: false,
        },
        {
          field: "Geo Position",
          value: "Madrid(Spain)",
          action: false,
        },
      ],
      count: 0,
      pageLength: 5,
      filtered: false,
      curPage: 1,
      loading: true,
      rows: [],
      columns: [
        {
          label: "Date",
          field: "date",
        },
        {
          label: "Case Name",
          field: "caseName",
        },
        {
          label: "Link Name",
          field: "link",
        },
        {
          label: "URL",
          field: "url",
        },
        {
          label: "Referrer",
          field: "referrer",
        },
        {
          label: "User Agent",
          field: "userAgent",
        },
        {
          label: "Relevant",
          field: "relevant",
        },
      ],
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
    };
  },
  created() {
    this.$http
      .get(`api/ipaccess/countperday/?host=${this.addr}`)
      .then((res) => {
        const { labels, data } = getLabelsAndData(res);

        this.actData.labels = labels;
        this.actData.datasets[0].data = data;
      });

    this.loadData();
  },
};
/* eslint-disable global-require */
</script>

<style lang="scss" >
@import "@core/scss/vue/libs/vue-good-table.scss";
</style>
<style>
.hidden {
  display: none;
}
</style>
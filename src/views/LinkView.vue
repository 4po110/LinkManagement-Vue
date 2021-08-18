<template>
  <b-row class="match-height">
    <b-col cols="8">
      <b-card no-body>
        <div class="card-header">
          <b-card-title>Link (id={{ id }})</b-card-title>
          <b-button
            v-ripple.400="'rgba(234, 84, 85, 0.15)'"
            variant="outline-danger"
            @click="onRemove()"
          >
            Remove Link
          </b-button>
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
          <template #cell(value)="{ item, value, field: { key } }">
            <template v-if="!item.isEditing">{{ value }}</template>
            <b-form-input v-else v-model="item[key]" />
          </template>
          <template #cell(action)="{ item, value }">
            <b-button
              v-if="value === true"
              v-ripple.400="'rgba(113, 102, 240, 0.15)'"
              variant="flat-primary"
              @click="onEdit(item)"
            >
              {{ item.isEditing ? "Save" : "Edit" }}
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
        :pageNum="curPage"
        :filter="true"
      />
    </b-col>
  </b-row>
</template>

<script>
/* eslint-disable */
import {
  BRow,
  BCol,
  BTable,
  BCard,
  BButton,
  BCardTitle,
  BFormInput,
} from "bootstrap-vue";
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
    BFormInput,

    GoodTableBasicEx,
    ChartjsBarChartEx,
  },
  directives: {
    Ripple,
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
      }
    },

    loadData() {
      const relevantQuery = this.filtered ? `&relevant=true` : "";

      this.$http
        .get(`api/linkaccess/count/?link_id=${this.id}${relevantQuery}`)
        .then((res) => {
          this.count = res.data;
          this.curPage = Math.min(
            Math.ceil(this.count / this.pageLength), this.curPage
          );

          console.log("---------DEBUG----------", this.count, this.curPage)
          if(this.count === 0) {
            this.curPage = 1;
            this.rows = [];
            return;
          }

          this.$http
            .get(
              `/api/linkaccess/${this.id}/?p=${this.curPage}&page_size=${this.pageLength}${relevantQuery}`
            )
            .then((res) => {
              const rows = Array(Number(this.count)).fill({});
              const result = res.data.map((item) => {
                return {
                  id: item.id,
                  date: item.timestamp.split(".")[0],
                  ipAddr: item.host,
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

              this.rows = rows;
              this.loading = false;
            });
        });
    },
    onEdit(item) {
      if (item.isEditing) {
        const formData = new FormData();
        const caseName = this.data[1].value;
        const linkName = this.data[2].value;

        formData.append("case", caseName);
        formData.append("name", linkName);

        this.$http.put(`/api/links/${this.id}/`, formData);
        item.isEditing = false;
      } else this.$set(item, "isEditing", true);
    },

    onRemove() {
      this.$bvModal
        .msgBoxConfirm("Please confirm that you want to delete link.", {
          title: "Please Confirm",
          size: "sm",
          okVariant: "primary",
          okTitle: "Yes",
          cancelTitle: "No",
          cancelVariant: "outline-secondary",
          hideHeaderClose: false,
          centered: true,
        })
        .then((value) => {
          if (value === true) {
            this.$http.delete(`/api/links/${this.id}/`).then(() => {
              router.go(-1);
            });
          }
        });
    },
  },
  setup() {
    const id = router.currentRoute.params.id;

    return {
      id,
    };
  },
  data() {
    return {
      title: "Activity",
      data: [],
      rows: [],
      count: 0,
      pageLength: 5,
      curPage: 1,
      loading: true,
      columns: [
        {
          label: "Date",
          field: "date",
        },
        {
          label: "IP",
          field: "ipAddr",
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
    this.$http.get(`/api/linkaccess/${this.id}/infolink/`).then((res) => {
      const data = res.data[0];

      this.data = [
        { field: "Id", value: data.id, action: false },
        { field: "CaseName", value: data.case, action: true },
        { field: "LinkName", value: data.name, action: true },
        { field: "URL", value: data.path, action: false },
        { field: "Type", value: "link", action: false },
        { field: "Created", value: data.created_date, action: false },
        { field: "Last Activity", value: data.last_date, action: false },
        { field: "Clicks", value: data.accesses, action: false },
      ];
    });

    this.$http
      .get(`/api/linkaccess/accessforamonth/?link_id=${this.id}`)
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
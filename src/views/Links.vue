<template>
  <b-row class="match-height">
    <b-col cols="12">
      <good-table-basic-ex
        :columns="columns"
        :rows="rows"
        :title="title"
        :onAction="onAction"
        :loading="loading"
        :pageNum="curPage"
        type="Link"
      />
    </b-col>
  </b-row>
</template>

<script>
/* eslint-disable */
import { BRow, BCol } from "bootstrap-vue";
import router from "@/router";

import GoodTableBasicEx from "./table/vue-good-table/GoodTableBasicEx.vue";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";

export default {
  components: {
    BRow,
    BCol,

    GoodTableBasicEx,
    ToastificationContent,
  },
  methods: {
    onAction(action, value) {
      switch (action) {
        case "New":
          router.push({ name: "link-add" });
          break;
        case "Delete":
          this.showMsgBox(value);
          break;
        case "Activity":
          router.push({ name: "link-view", params: { id: value } });
          break;
        case "UpdatePerPage":
          this.pageLength = value;
          this.loading = true;
          this.loadData();
          break;
        case "UpdatePage":
          console.log("------DEBUG----UpdatePage", value);
          this.curPage = value;
          this.loading = true;
          this.loadData();
          break;
      }
    },
    showMsgBox(id) {
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
            this.$http
              .delete(`/api/links/${id}/`)
              .then(() => {
                this.loadData();
                this.showToast(true);
              })
              .catch(() => {
                this.showToast(false);
              });
          }
        });
    },
    loadData() {
      this.$http.get("/api/links/count/").then((res) => {
        this.count = res.data;
        this.curPage = Math.min(
          Math.ceil(this.count / this.pageLength),
          this.curPage
        );

        if (this.count === 0) {
          this.rows = [];
          this.curPage = 1;
          return;
        }

        this.$http
          .get(`/api/links/?p=${this.curPage}&page_size=${this.pageLength}`)
          .then(async (res) => {
            const rows = Array(Number(this.count)).fill({});
            const result = await Promise.all(
              res.data.map(async (item) => {
                const res = await this.$http.get(
                  `/api/linkaccess/${item.id}/infolink/`
                );
                const data = res.data[0];

                return {
                  id: data.id,
                  caseName: data.case,
                  linkName: data.name,
                  url: data.path,
                  createdDate: data.created_date.split(".")[0],
                  lastActivity: data.last_date
                    ? data.last_date.split(".")[0]
                    : "",
                  clicks: data.accesses,
                };
              })
            );
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
    showToast(success) {
      this.$toast({
        component: ToastificationContent,
        position: "top-right",
        props: {
          title: success ? "Success" : "Failed",
          icon: "CoffeeIcon",
          variant: success ? "success" : "warning",
          text: success
            ? "You have successfully deleted a link."
            : "An error occurred while deleting a link.",
        },
      });
    },
  },
  data() {
    return {
      title: "My Links",
      rows: [],
      count: 0,
      pageLength: 5,
      curPage: 1,
      loading: true,
      columns: [
        {
          label: "Case Name",
          field: "caseName",
        },
        {
          label: "Link Name",
          field: "linkName",
        },
        {
          label: "URL",
          field: "url",
        },
        {
          label: "Created",
          field: "createdDate",
        },
        {
          label: "Last Activity",
          field: "lastActivity",
        },
        {
          label: "Click",
          field: "clicks",
        },
        {
          label: "Activity",
          field: "action",
        },
        {
          label: "Delete",
          field: "action",
        },
      ],
    };
  },
  created() {
    this.loadData();
  },
};
/* eslint-disable global-require */
</script>

<style lang="scss" >
@import "@core/scss/vue/libs/vue-good-table.scss";
</style>

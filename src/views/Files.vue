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
        type="File"
      />
    </b-col>
  </b-row>
</template>

<script>
/* eslint-disable */
import { BRow, BCol } from "bootstrap-vue";
import router from "@/router";
import filesize from "filesize";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";

import GoodTableBasicEx from "./table/vue-good-table/GoodTableBasicEx.vue";

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
          router.push({ name: "file-add" });
          break;
        case "Delete":
          this.showMsgBox(value);
          break;
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
      }
    },
    showMsgBox(id) {
      this.$bvModal
        .msgBoxConfirm("Please confirm that you want to delete file.", {
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
              .delete(`/api/files/${id}/`)
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
      this.$http.get("/api/files/count/").then((res) => {
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
          .get(`/api/files/?p=${this.curPage}&page_size=${this.pageLength}`)
          .then((res) => {
            const rows = Array(Number(this.count)).fill({});
            const result = res.data.map((item) => {
              return {
                id: item.id,
                thumbnail: item.thumbnail,
                fileName: item.file,
                fileSize: filesize(item.size),
                commonFile: item.user === "shared_user" ? "Yes" : "No",
                createdDate: item.date_created.split(".")[0],
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
    showToast(success) {
      this.$toast({
        component: ToastificationContent,
        position: "top-right",
        props: {
          title: success ? "Success" : "Failed",
          icon: "CoffeeIcon",
          variant: success ? "success" : "warning",
          text: success
            ? "You have successfully deleted a file."
            : "An error occurred while deleting a file.",
        },
      });
    },
  },
  data() {
    return {
      title: "My Files",
      rows: [],
      count: 0,
      pageLength: 5,
      curPage: 1,
      loading: true,
      columns: [
        {
          label: "",
          field: "thumbnail",
        },
        {
          label: "File Name",
          field: "fileName",
        },
        {
          label: "File Size",
          field: "fileSize",
        },
        {
          label: "Common File",
          field: "commonFile",
        },
        {
          label: "Created",
          field: "createdDate",
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

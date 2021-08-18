<template>
  <b-card no-body>
    <div class="card-header">
      <!-- Title & SubTitle -->
      <b-card-title>New File</b-card-title>
    </div>
    <b-card-body>
      <b-form @submit.prevent>
        <b-row>
          <b-col cols="12" class="mb-2">
            <b-form-file
              v-model="file"
              :state="Boolean(file)"
              placeholder="Choose a file or drop it here..."
              drop-placeholder="Drop file here..."
            />
          </b-col>
          <b-col offset-md="4">
            <b-button
              v-ripple.400="'rgba(255, 255, 255, 0.15)'"
              type="submit"
              variant="primary"
              class="mr-1"
              @click="onUpload"
            >
              Upload
            </b-button>
            <b-button
              v-ripple.400="'rgba(186, 191, 199, 0.15)'"
              type="cancel"
              variant="outline-secondary"
              @click="onCancel"
            >
              Cancel
            </b-button>
          </b-col>
        </b-row>
      </b-form>
    </b-card-body>
  </b-card>
</template>

<script>
/* eslint-disable */
import {
  BCard,
  BCardTitle,
  BCardBody,
  BRow,
  BCol,
  BForm,
  BButton,
  BFormFile,
} from "bootstrap-vue";
import Ripple from "vue-ripple-directive";
import router from "@/router";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";

export default {
  components: {
    BCard,
    BCardTitle,
    BCardBody,
    BRow,
    BCol,
    BForm,
    BButton,
    BFormFile,

    ToastificationContent,
  },
  directives: {
    Ripple,
  },
  methods: {
    onUpload() {
      const formData = new FormData();

      formData.append("file", this.file);
      this.$http
        .post("/api/files/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(() => {
          this.showToast(true);
          router.go(-1);
        })
        .catch(() => {
          this.showToast(false);
        });
    },

    onCancel() {
      router.go(-1);
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
            ? "You have successfully created a file."
            : "An error occurred while creating a file.",
        },
      });
    },
  },
  data() {
    return {
      file: null,
    };
  },
};
</script>

<template>
  <b-card no-body>
    <div class="card-header">
      <!-- Title & SubTitle -->
      <b-card-title>New Link</b-card-title>
    </div>
    <b-card-body>
      <validation-observer ref="simpleRules">
        <b-form @submit.prevent>
          <b-row>
            <b-col cols="12">
              <b-form-group
                label="Case Name"
                label-for="h-case-name"
                label-cols-md="4"
              >
                <validation-provider
                  #default="{ errors }"
                  rules="required"
                  name="Case Name"
                >
                  <b-form-input
                    id="h-case-name"
                    placeholder="Case Name"
                    v-model="caseName"
                    :state="errors.length > 0 ? false : null"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col cols="12">
              <b-form-group
                label="Link Name"
                label-for="h-link-name"
                label-cols-md="4"
              >
                <validation-provider
                  #default="{ errors }"
                  rules="required"
                  name="Link Name"
                >
                  <b-form-input
                    id="h-link-name"
                    placeholder="Link Name"
                    v-model="linkName"
                    :state="errors.length > 0 ? false : null"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col cols="12">
              <b-form-group
                label="Folder"
                label-for="h-folder"
                label-cols-md="4"
              >
                <validation-provider
                  #default="{ errors }"
                  rules="required"
                  name="Folder"
                >
                  <b-form-input
                    id="h-folder"
                    placeholder="Folder"
                    v-model="folder"
                    :state="errors.length > 0 ? false : null"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>

            <b-col cols="12">
              <validation-provider
                name="Domain"
                :rules="{ required: true }"
                v-slot="validationContext"
              >
                <b-form-group
                  label="Domain"
                  label-for="h-domain"
                  label-cols-md="4"
                >
                  <b-form-select
                    v-model="domainSelected"
                    :options="options"
                    :state="getValidationState(validationContext)"
                  />
                  <b-form-invalid-feedback>{{
                    validationContext.errors[0]
                  }}</b-form-invalid-feedback>
                </b-form-group>
              </validation-provider>
            </b-col>
            <b-col cols="12">
              <b-form-group label="File" label-for="h-file" label-cols-md="4">
                <vue-perfect-scrollbar
                  :settings="perfectScrollbarSettings"
                  class="scroll-area"
                >
                  <b-form-radio
                    v-if="!isLoading"
                    v-model="fileSelected"
                    class="mb-1"
                    name="file"
                    value=""
                  >
                    <h6 class="align-self-center my-auto">
                      Empty file
                    </h6>
                  </b-form-radio>
                  <div v-for="group in groupData" :key="group.type">
                    <h6 class="text-info section-label mt-2 mb-1">
                      {{ group.type }}
                    </h6>
                    <b-form-radio
                      v-for="file in group.files"
                      v-model="fileSelected"
                      class="mb-1"
                      name="file"
                      :key="file.id"
                      :value="file.id"
                    >
                      <b-media no-body>
                        <b-media-aside class="mr-1" v-if="file.isImage">
                          <b-img
                            :src="file.thumbnail"
                            alt="browser img"
                            height="32px"
                          />
                        </b-media-aside>
                        <b-media-body>
                          <h6 class="align-self-center my-auto">
                            {{ file.name }}
                          </h6>
                        </b-media-body>
                      </b-media>
                    </b-form-radio>
                  </div>
                </vue-perfect-scrollbar>
              </b-form-group>
            </b-col>
            <!-- submit and reset -->
            <b-col offset-md="4">
              <b-button
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                type="submit"
                variant="primary"
                class="mr-1"
                @click="onCreate"
              >
                Create
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
      </validation-observer>
    </b-card-body>
  </b-card>
</template>

<script>
/* eslint-disable */
import {
  BRow,
  BCol,
  BFormGroup,
  BFormInput,
  BFormRadio,
  BForm,
  BButton,
  BFormSelect,
  BFormInvalidFeedback,
  BCard,
  BCardTitle,
  BCardBody,
  BMedia,
  BMediaAside,
  BMediaBody,
  BImg,
} from "bootstrap-vue";
import Ripple from "vue-ripple-directive";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import { required } from "@validations";
import router from "@/router";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";

export default {
  components: {
    BCard,
    BCardTitle,
    BCardBody,
    BRow,
    BCol,
    BFormGroup,
    BFormInput,
    BFormRadio,
    BFormInvalidFeedback,
    BForm,
    BButton,
    BMedia,
    BMediaAside,
    BMediaBody,
    BImg,
    BFormSelect,

    ValidationProvider,
    ValidationObserver,

    // 3rd Party
    ToastificationContent,
    VuePerfectScrollbar,
  },
  directives: {
    Ripple,
  },
  methods: {
    getValidationState({ dirty, validated, valid = null }) {
      return dirty || validated ? valid : null;
    },
    onCreate() {
      this.$refs.simpleRules.validate().then((success) => {
        if (success) {
          // eslint-disable-next-line
          const formData = new FormData();

          formData.append("name", this.linkName);
          formData.append("domain", this.domainSelected);
          formData.append("case", this.caseName);
          formData.append("folder", this.folder);
          formData.append("file", this.fileSelected);
          this.$http
            .post("/api/links/", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            })
            .then(() => {
              this.showToast(true, "You have successfully created a new link.");
              router.go(-1);
            })
            .catch((err) => {
              let msg = "Failed to created a new link."

              if( err.response ) {  
                const data = err.response.data;
                if(data.hasOwnProperty("name")) msg = data.name[0];
                else if(data.hasOwnProperty("url")) msg = data.url[0];
              }

              this.showToast(false, msg);
            });
        }
      });
    },
    showToast(success, msg) {
      this.$toast({
        component: ToastificationContent,
        position: "top-right",
        props: {
          title: success ? "Success" : "Failed",
          icon: "CoffeeIcon",
          variant: success ? "success" : "warning",
          text: msg
        },
      });
    },
    onCancel() {
      router.go(-1);
    },
  },
  setup() {
    const perfectScrollbarSettings = {
      maxScrollbarLength: 150,
    };

    return {
      // UI
      perfectScrollbarSettings,
    };
  },
  data() {
    return {
      fileSelected: null,
      domainSelected: null,
      isLoading: true,
      options: [],
      caseName: "",
      linkName: "",
      folder: "",
      groupData: [],
      required,
    };
  },
  created() {
    this.$http.get(`/api/domains/`).then((res) => {
      this.options = res.data.map((item) => {
        return {
          value: item.id,
          text: item.name,
        };
      });
      this.options.push({ value: null, text: "Please select an option" });
    });

    this.$http.get("/api/files/count/").then((res) => {
      this.$http.get(`/api/files/?p=1&page_size=${res.data}`).then((res) => {
        const result = res.data.map((item) => {
          return {
            id: item.id,
            name: item.name,
            isCommon: item.user === "shared_user",
            thumbnail: `data:image/jpeg;base64,${item.thumbnail}`,
            isImage: item.thumbnail !== undefined,
          };
        });
        const commonFiles = result.filter((item) => item.isCommon);
        const defaultFiles = result.filter((item) => !item.isCommon);

        this.groupData = [
          {
            type: "Common Files",
            files: commonFiles,
          },
          {
            type: "Default Files",
            files: defaultFiles,
          },
        ];
        this.isLoading = false;
      });
    });
  },
};
</script>
<style>
.scroll-area {
  height: 300px;
  border: 1px solid #ebe9f1;
  border-radius: 0.25rem;
  padding: 0.786rem 1.286rem;
}
</style>
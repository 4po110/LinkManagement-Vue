<template>
  <b-card>
    <div class="card-header p-0 pb-2">
      <b-card-title>{{ title }}</b-card-title>
      <b-form-checkbox
        :checked="filtered"
        v-if="filter === true"
        @change="onFilterChanged()"
        >relevant</b-form-checkbox
      >
      <b-button
        v-if="type !== undefined"
        v-ripple.400="'rgba(113, 102, 240, 0.15)'"
        variant="outline-primary"
        @click="onClick('New', null)"
      >
        New {{ type }}
      </b-button>
    </div>
    <!-- table -->
    <vue-good-table
      :columns="columns"
      :rows="rows"
      :rtl="direction"
      :pagination-options="{
        enabled: true,
        perPage: pageLength,
      }"
      :sort-options="{
        enabled: false,
      }"
    >
      <template slot="table-row" slot-scope="props">
        <span v-if="loading"> </span>

        <span v-else-if="props.column.field === 'ipAddr'" class="text-nowrap">
          <b-link
            :to="{ name: 'ip-view', params: { addr: props.row.ipAddr } }"
            class="font-weight-bold"
          >
            {{ props.row.ipAddr }}
          </b-link>
        </span>
        <span v-else-if="props.column.field === 'link'" class="text-nowrap">
          <b-link
            :to="{ name: 'link-view', params: { id: props.row.link.id } }"
            class="font-weight-bold"
          >
            {{ props.row.link.name }}
          </b-link>
        </span>
        <span v-else-if="props.column.field === 'relevant'" class="text-nowrap">
          <b-form-checkbox
            :checked="props.row.relevant"
            class="font-weight-bold"
            @change="onRelevantChange(props.row)"
          />
        </span>
        <b-img
          v-else-if="
            props.column.field === 'thumbnail' &&
            props.row.thumbnail !== undefined
          "
          :src="`data:image/jpeg;base64,${props.row.thumbnail}`"
          alt="browser img"
          height="32px"
        />

        <!-- Column: Action -->
        <span v-else-if="props.column.field === 'action'">
          <span v-if="props.row.commonFile === 'Yes'"> </span>
          <span v-else>
            <b-button
              v-ripple.400="'rgba(113, 102, 240, 0.15)'"
              variant="outline-primary"
              class="btn-icon"
              @click="onClick(props.column.label, props.row.id)"
            >
              <span v-if="props.column.label === 'Activity'">
                <feather-icon icon="ArrowRightIcon" />
              </span>
              <span v-else-if="props.column.label === 'Delete'">
                <feather-icon icon="XIcon" />
              </span>
            </b-button>
          </span>
        </span>

        <!-- Column: Common -->
        <span v-else>
          {{ props.formattedRow[props.column.field] }}
        </span>
      </template>

      <!-- pagination -->
      <template slot="pagination-bottom" slot-scope="props">
        <div class="d-flex justify-content-between flex-wrap">
          <div class="d-flex align-items-center mb-0 mt-1">
            <span class="text-nowrap"> Showing 1 to </span>
            <b-form-select
              v-model="pageLength"
              :options="['5', '10', '20']"
              class="mx-1"
              @input="(value) => onPerPageChanged(props, value)"
            />
            <span class="text-nowrap"> of {{ props.total }} entries </span>
          </div>
          <div>
            <b-pagination
              :value="pageNum"
              :total-rows="props.total"
              :per-page="pageLength"
              first-number
              last-number
              align="right"
              prev-class="prev-item"
              next-class="next-item"
              class="mt-1 mb-0"
              @input="(value) => onPageChanged(props, value)"
            >
              <template #prev-text>
                <feather-icon icon="ChevronLeftIcon" size="18" />
              </template>
              <template #next-text>
                <feather-icon icon="ChevronRightIcon" size="18" />
              </template>
            </b-pagination>
          </div>
        </div>
      </template>
    </vue-good-table>
  </b-card>
</template>

<script>
/* eslint-disable */
import {
  BButton,
  BAvatar,
  BBadge,
  BPagination,
  BFormGroup,
  BFormInput,
  BFormSelect,
  BDropdown,
  BDropdownItem,
  BLink,
  BCard,
  BCardTitle,
  BImg,
  BFormCheckbox,
} from "bootstrap-vue";
import { VueGoodTable } from "vue-good-table";
import Ripple from "vue-ripple-directive";
import store from "@/store/index";
import { codeBasic } from "./code";
import FormCheckbox from "@/views/forms/form-element/form-checkbox/FormCheckbox.vue";

export default {
  components: {
    BCard,
    BCardTitle,
    VueGoodTable,
    BAvatar,
    BBadge,
    BPagination,
    BFormGroup,
    BFormInput,
    BFormSelect,
    BDropdown,
    BDropdownItem,
    BButton,
    BLink,
    BImg,
    BFormCheckbox,
    FormCheckbox,
  },
  directives: {
    Ripple,
  },
  props: {
    columns: Array,
    rows: Array,
    title: String,
    type: String,
    loading: Boolean,
    onAction: Function,
    filter: Boolean,
    pageNum: Number,
  },
  methods: {
    onClick(action, id) {
      if (this.onAction) this.onAction(action, id);
    },

    onPageChanged(props, value) {
      console.log("--------DEBUG--------onPageChanged", value);
      props.pageChanged({ currentPage: value });
      this.onAction("UpdatePage", value);
    },

    onPerPageChanged(props, value) {
      props.perPageChanged({ currentPerPage: value });
      this.onAction("UpdatePerPage", value);
    },

    onRelevantChange(row) {
      this.onAction("UpdateRelevant", row);
    },

    onFilterChanged() {
      this.filtered = !this.filtered;
      this.onAction("UpdateFilter", this.filtered);
    },
  },
  data() {
    return {
      pageLength: 5,
      filtered: false,
      dir: false,
      codeBasic,
      searchTerm: "",
      status: [
        {
          1: "Current",
          2: "Professional",
          3: "Rejected",
          4: "Resigned",
          5: "Applied",
        },
        {
          1: "light-primary",
          2: "light-success",
          3: "light-danger",
          4: "light-warning",
          5: "light-info",
        },
      ],
    };
  },
  computed: {
    statusVariant() {
      const statusColor = {
        /* eslint-disable key-spacing */
        Current: "light-primary",
        Professional: "light-success",
        Rejected: "light-danger",
        Resigned: "light-warning",
        Applied: "light-info",
        /* eslint-enable key-spacing */
      };

      return (status) => statusColor[status];
    },
    direction() {
      if (store.state.appConfig.isRTL) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.dir = true;
        return this.dir;
      }
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.dir = false;
      return this.dir;
    },
  },
};
</script>

<template>
  <b-card no-body>
    <div class="card-header">
      <b-card-title>{{ title }}</b-card-title>
    </div>
    <b-table :fields="fields" :items="items" responsive class="mb-0 mh-300">
      <!-- A virtual composite column -->
      <template #cell(linkName)="data">
        <b-link
          :to="{ name: 'link-view', params: { id: data.value.id } }"
          class="font-weight-bold"
        >
          {{ data.value.name }}
        </b-link>
      </template>

      <!-- Optional default data cell scoped slot -->
      <template #cell()="data">
        {{ data.value }}
      </template>
    </b-table>
  </b-card>
</template>

<script>
/* eslint-disable */
import { BTable, BLink, BCard, BCardTitle } from "bootstrap-vue";

export default {
  components: {
    BTable,
    BLink,

    BCard,
    BCardTitle,
  },
  props: ["title", "items", "fields"],
  data() {
    return {};
  },
};
</script>
<style scoped>
.mh-300 {
  max-height: 300px;
}
</style>
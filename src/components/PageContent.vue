<template>
  <b-row class="full-height p-2">
    <b-col class="section border-right">
      <resources-tree :appRoot="data" v-on:nodeSelect="selectedNode = $event" />
    </b-col>
    <b-col class="section">
      <resource-data :node="selectedNode"></resource-data>
    </b-col>
  </b-row>
</template>

<script>
import ResourcesTree from "./ResourcesTree.vue";
import ResourceData from "./ResourceData.vue";

export default {
  components: {
    "resources-tree": ResourcesTree,
    "resource-data": ResourceData,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      selectedNode: null,
    };
  },
};
</script>

<style scoped>
.section {
  height: 100%;
  overflow-y: auto;
}
</style>
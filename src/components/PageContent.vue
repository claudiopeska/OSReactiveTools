<template>
  <b-row class="full-height p-2">
    <b-col class="section border-right">
      <resources-tree v-on:nodeSelect="selectedNode = $event" />
    </b-col>
    <b-col class="section">
      <resource-data :node="selectedNode"></resource-data>
    </b-col>
  </b-row>
</template>

<script>
import ResourcesTree from "@/components/ResourcesTree.vue";
import ResourceData from "@/components/ResourceData.vue";

export default {
  components: {
    "resources-tree": ResourcesTree,
    "resource-data": ResourceData,
  },
  data() {
    return {
      selectedNode: null,
    };
  }
};
</script>

<style scoped>
.section {
  height: 100%;
  overflow-y: auto;
}
</style>
<template>
  <b-row class="full-height p-2">
    <b-col class="section border-right">
      <resources-tree :data="data" v-on:nodeSelect="selectedNode = $event" />
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

/*  
//const acceptRequestTypes = ["xhr"];
//regex to identify resource and action from request url
//const requestUrlRegex = /(\w+\/\w+\/\w+)\/(\w+)$/g;
chrome.devtools.network.onRequestFinished.addListener((request) => {
    if (acceptRequestTypes.indexOf(request._resourceType) >= 0) {
        //reset regex
        requestUrlRegex.lastIndex = 0;

        var regexResult = requestUrlRegex.exec(request.request.url);
        if (!regexResult || regexResult.length == 0) {
            return;
        }

        regexResult[1] = regexResult[1].replaceAll("/", ".");

        var dataAction = this.resources[regexResult[1]]?.dataActions[regexResult[2]];
        if (!dataAction) { return; }

        request.getContent((content) => {
            this.$set(dataAction, "response", JSON.parse(content).data);
            this.treeData = this.buildTreeData(this.resources);
        });
    }
});*/
</script>

<style scoped>
.section {
  height: 100%;
  overflow-y: auto;
}
</style>
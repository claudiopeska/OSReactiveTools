<template>
  <b-container fluid class="main_app bg-light-gray">
    <b-row class="header border-bottom border-gray">
      <b-col>
        <h3>OutSystems Reactive Tools</h3>
      </b-col>
      <b-col>
        <network-analyzer
          v-on:resourceResponse="receiveResourceResponse"
        ></network-analyzer>
      </b-col>
    </b-row>
    <div class="content">
      <page-content class="pt-3" :data="pageResources"></page-content>
    </div>
  </b-container>
</template>

<script>
import PageContent from "../components/PageContent.vue";
import NetworkAnalyzer from "../components/NetworkAnalyzer.vue";
import { ResourcesLoader } from "../js/ResourcesLoader.js";

export default {
  components: {
    "page-content": PageContent,
    "network-analyzer": NetworkAnalyzer,
  },
  name: "devtools",
  data() {
    return {
      pageResources: null,
    };
  },
  mounted() {
    //this should be executed when there is navigation
    ResourcesLoader((loadedResources) => {
      this.pageResources = loadedResources;
    });
  },
  methods: {
    receiveResourceResponse(eventData) {
      var dataAction =
        this.pageResources[eventData.resourceName]?.dataActions[
          eventData.dataActionName
        ];
      if (!dataAction) {
        return;
      }
      this.$set(dataAction, "response", eventData.response);
    },
  },
};
</script>

<style>
.bg-light-gray {
  background-color: #e9ecef;
}

html,
body {
  height: 100%;
  background-color: #e9ecef;
}

.main_app,
.full-height {
  height: 100%;
}

.header {
  height: 55px;
  display: flex;
  align-items: center;
}

.content {
  height: calc(100% - 55px);
}
</style>
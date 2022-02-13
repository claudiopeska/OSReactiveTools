<template>
  <b-container fluid class="main_app bg-light-gray">
    <b-row class="header border-bottom border-gray">
      <b-col>
        <h3>OutSystems Reactive Tools</h3>
      </b-col>
      <b-col>
        <network-analyzer v-on:resourceResponse="receiveResourceResponse" />
      </b-col>
    </b-row>
    <div class="content">
      <page-content class="pt-3" :data="resources"></page-content>
    </div>
    <resource-listener v-on:newResource="receiveNewResource" />
  </b-container>
</template>

<script>
import PageContent from "../components/PageContent.vue";
import NetworkAnalyzer from "../components/NetworkAnalyzer.vue";
import ResourceListener from "../components/ResourceListener.vue";

export default {
  components: {
    "page-content": PageContent,
    "network-analyzer": NetworkAnalyzer,
    "resource-listener": ResourceListener,
  },
  name: "devtools",
  data() {
    return {
      resources: {},
      tabId: chrome.devtools.inspectedWindow.tabId,
    };
  },
  methods: {
    receiveResourceResponse(eventData) {
      var dataAction =
        this.resources[eventData.resourceName]?.dataActions[
          eventData.dataActionName
        ];
      if (!dataAction) {
        return;
      }
      this.$set(dataAction, "requestData", eventData.requestData);
    },
    receiveNewResource(eventData) {
      if (!this.resources[eventData.name]) {
        this.$set(this.resources, eventData.name, eventData);
      }
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
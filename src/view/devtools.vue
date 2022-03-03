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
      <!--{{ Object.keys(appRoot.resources) }}-->
      <!--{{ appRoot }}-->
      <page-content class="pt-3" :data="appRoot"></page-content>
    </div>
    <resource-listener v-on:newResource="receiveNewResource" />
    <local-storage v-on:localStorage="receiveLocalStorage" />
  </b-container>
</template>

<script>
import PageContent from "../components/PageContent.vue";
import NetworkAnalyzer from "../components/NetworkAnalyzer.vue";
import ResourceListener from "../components/ResourceListener.vue";
import AppLocalStorage from "../components/AppLocalStorage.vue";

export default {
  components: {
    "page-content": PageContent,
    "network-analyzer": NetworkAnalyzer,
    "resource-listener": ResourceListener,
    "local-storage": AppLocalStorage,
  },
  name: "devtools",
  data() {
    return {
      appRoot: {
        data: {},
        resources: {},
      },
    };
  },
  methods: {
    receiveResourceResponse(eventData) {
      var dataAction =
        this.appRoot.resources[eventData.resourceName]?.dataActions[
          eventData.dataActionName
        ];
      if (!dataAction) {
        return;
      }
      this.$set(dataAction, "requestData", eventData.requestData);
      var requestCount = dataAction.requestsCount
        ? dataAction.requestsCount + 1
        : 1;
      dataAction.requestsCount = requestCount;
      this.$set(dataAction.requestData, "requestsCount", requestCount);
    },
    receiveNewResource(eventData) {
      if (!this.appRoot.resources[eventData.name]) {
        this.$set(this.appRoot.resources, eventData.name, eventData);
      }
    },
    receiveLocalStorage(eventData) {
      this.$set(this.appRoot.data, "localStorage", eventData);
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
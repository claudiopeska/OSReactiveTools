<template>
  <b-container fluid class="main_app bg-light-gray">
    <b-row class="header border-bottom border-gray">
      <b-col>
        <h3>OutSystems Reactive Tools</h3>
      </b-col>
      <b-col>
        <network-analyzer />
      </b-col>
    </b-row>
    <div class="content">
      <page-content class="pt-3"></page-content>
    </div>
  </b-container>
</template>

<script>
import ResourceListenerService from "@/services/ResourceListenerService.js";
import LocalStorageReaderService from "@/services/LocalStorageReaderService.js";
import PageContent from "@/components/PageContent.vue";
import NetworkAnalyzer from "@/components/NetworkAnalyzer.vue";

export default {
  components: {
    "page-content": PageContent,
    "network-analyzer": NetworkAnalyzer,
  },
  name: "devtools",
  mounted() {
    ResourceListenerService.initListeners();
    LocalStorageReaderService.readLocalStorage();
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
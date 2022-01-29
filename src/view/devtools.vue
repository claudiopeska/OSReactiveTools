<template>
  <b-container fluid class="main_app bg-light-gray">
    <b-row class="header border-bottom border-gray">
      <b-col>
        <h3>OutSystems Reactive Tools</h3>
      </b-col>
      <b-col>
        <b-button size="sm" v-on:click="refresh">Analyze Data</b-button>
      </b-col>
    </b-row>
    <div class="content">
      <resources class="pt-3"></resources>
    </div>
  </b-container>
</template>

<script>
import PageResources from "./PageResources.vue";

export default {
  name: "devtools",
  components: {
    resources: PageResources,
  },
  methods:{
    refresh: function(){
      chrome.devtools.inspectedWindow.reload();
    }
  }
};
</script>

<style>
.bg-light-gray {
  background-color: #e9ecef;
}

html,
body {
  height: 100%;
}

.main_app, .full-height {
  height: 100%;
}

.header {
  height: 55px;
  display: flex;
  align-items: center;
}

.content{
  height: calc(100% - 55px);
}
</style>
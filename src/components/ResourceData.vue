<template>
  <div v-if="node">
    <div v-if="node.data">
      <b-row class="mb-2">
        <b-col class="font-weight-bold">
          <i v-bind:class="node.icon"></i>
          {{ node.name }}
        </b-col>
        <b-col cols="auto">
          <b-button size="sm" variant="info" v-on:click="openResourceAction">
            Go to Source
          </b-button>
        </b-col>
      </b-row>
      <div v-if="node.data.response">
        <resource-response :response="node.data.response"></resource-response>
      </div>
      <div v-else>
        <b-col>No data yet</b-col>
      </div>
    </div>
  </div>
  <div v-else>No node selected</div>
</template>

<script>
import ResourceResponse from "./ResourceResponse.vue";

export default {
  components: {
    "resource-response": ResourceResponse,
  },
  props: {
    node: {
      type: Object,
      required: true,
    },
  },
  methods: {
    openResourceAction() {
      chrome.devtools.panels.openResource(
        this.node.data.url,
        this.node.data.debugLine
      );
    },
  },
};
</script>
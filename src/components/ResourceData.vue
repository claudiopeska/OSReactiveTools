<template>
  <div v-if="node">
    <b-row class="mb-2">
      <b-col class="font-weight-bold">
        <i v-bind:class="node.icon"></i>
        {{ node.name }}
      </b-col>
      <b-col cols="auto">
        <b-button
          size="sm"
          v-bind:disabled="node.data.disableNavigate"
          variant="info"
          v-on:click="openResourceAction(node.data.url, node.data.debugLine)"
        >
          Go to Source
        </b-button>
      </b-col>
    </b-row>
    <div v-if="node.data.requestData">
      <resource-action-data :data="node.data.requestData" />
    </div>
    <div v-else-if="node.data.clientActions">
      <b-col
        v-for="item in node.data.clientActions"
        v-bind:key="item.actionName">
        <b-link
          href="#"
          v-on:click="openResourceAction(item.url, item.debugLine)">
          {{ item.actionName }}
        </b-link>
      </b-col>
    </div>
    <div v-else-if="!node.children">
      <b-col>No data yet</b-col>
    </div>
    <div v-else-if="node.data.localStorage">
      <resource-app-data :data="node.data.localStorage" />
    </div>
  </div>
  <div v-else>No node selected</div>
</template>

<script>
import ResourceActionData from "@/components/ResourceActionData.vue";
import ResourceAppData from "@/components/ResourceAppData.vue";

export default {
  components: {
    "resource-action-data": ResourceActionData,
    "resource-app-data": ResourceAppData,
  },
  props: {
    node: {
      type: Object,
      required: true,
    },
  },
  methods: {
    openResourceAction(url, debugLine) {
      chrome.devtools.panels.openResource(url, debugLine);
    },
  },
};
</script>
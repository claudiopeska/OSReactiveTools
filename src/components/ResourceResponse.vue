<template>
  <b-tabs content-class="m-2" pills fill small>
    <b-tab title="Preview" active>
      <json-view class="json-tree-costumization" :data="response" :maxDepth="1" />
    </b-tab>
    <b-tab title="Response">
      <div class="position-relative">
        <b-button
          class="copyToClipboard"
          size="sm"
          variant="secondary"
          v-on:click="copyToClipboard"
        >
          <i class="bi-clipboard"></i>
        </b-button>
        <b-form-textarea
          v-model="response"
          ref="textjson"
          v-on:focus="$event.target.select()"
          readonly
          max-rows="99999"
          no-auto-shrink
          no-resize="true"
        />
      </div>
    </b-tab>
  </b-tabs>
</template>

<script>
import { JSONView } from "vue-json-component";

export default {
  components: {
    "json-view": JSONView,
  },
  props: {
    response: {
      type: Object,
      required: true,
    },
  },
  methods: {
    copyToClipboard() {
      this.$refs.textjson.focus();
      document.execCommand("copy");
    },
  },
};
</script>

<style scoped>
.position-relative {
  position: relative;
}

.copyToClipboard {
  position: absolute;
  right: 10px;
  top: 10px;
}

.json-tree-costumization{
  --vjc-arrow-size: 9px !important;
}
</style>
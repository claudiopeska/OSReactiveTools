<template>
  <b-tabs content-class="m-2" pills fill small>
    <b-tab title="Client Variables" active>
      <app-client-variables :data="data" />
    </b-tab>
    <b-tab title="Others">Yet still to be made...</b-tab>
  </b-tabs>
</template>

<script>
import AppClientVariables from "./ResourcesAppClientVariables.vue";

export default {
  components: {
    "app-client-variables": AppClientVariables,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style>
.text-overflow {
  overflow-x: auto;
}
.clickableCell:empty::before {
  content: "\A0";
}
</style>
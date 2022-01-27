<template>
  <div class="main_app">
    <b-container fluid>
      <resources></resources>
    </b-container>
  </div>
</template>

<script>
import PageResources from "./PageResources.vue";

export default {
  name: "devtools",
  components: {
    resources: PageResources,
  },
};
</script>
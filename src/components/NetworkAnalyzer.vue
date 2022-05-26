<template>
  <b-form-checkbox
    v-model="analyzeSwitch.state"
    :disabled="analyzeSwitch.disabled"
    name="check-button"
    switch
    @change="toggleAnalizeSwitch"
  >
    {{ analyzeSwitch.state ? "Analyzing data..." : "Start analyzing data" }}
  </b-form-checkbox>
</template>

<script>
import NetworkListenerService from "@/services/NetworkListenerService.js";

export default {
  data() {
    return {
      analyzeSwitch: {
        state: false,
        disabled: false,
      },
      networkListenerBound: null,
    };
  },
  methods: {
    toggleAnalizeSwitch() {
      if (this.analyzeSwitch.state) {
        this.analyzeSwitch.disabled = true;
        this.$swal
          .fire({
            html: "This will cause page to refresh.<br>Do you want to proceed?",
            showCancelButton: true,
          })
          .then((result) => {
            if (result.isConfirmed) {
              NetworkListenerService.addNetworkListener();
            } else {
              this.analyzeSwitch.state = false;
            }
            this.analyzeSwitch.disabled = false;
          });
      } else {
        NetworkListenerService.removeNetworkListener();
      }
    },
  },
};
</script>
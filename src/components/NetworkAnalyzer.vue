<template>
  <b-form-checkbox
    v-model="analyzeSwitch.state"
    :disabled="analyzeSwitch.disabled"
    name="check-button"
    switch
    @change="toggleAnalizeSwitch"
  >
    {{ analyzeSwitch.state ? analyzeSwitch.labelOn : analyzeSwitch.labelOff }}
  </b-form-checkbox>
</template>

<script>
const acceptRequestTypes = ["xhr"];
//regex to identify resource and action from request url
const requestUrlRegex = /(\w+\/\w+\/\w+)\/(\w+)$/g;

export default {
  data() {
    return {
      analyzeSwitch: {
        state: false,
        disabled: false,
        labelOff: "Start analyzing data",
        labelOn: "Analyzing data...",
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
              this.addNetworkListener();
            } else {
              this.analyzeSwitch.state = false;
            }
            this.analyzeSwitch.disabled = false;
          });
      } else {
        this.removeNetworkListener();
      }
    },
    addNetworkListener() {
      this.networkListenerBound = this.networkListenerCallback.bind(this);
      chrome.devtools.network.onRequestFinished.addListener(
        this.networkListenerBound
      );
      chrome.devtools.inspectedWindow.reload();
    },
    removeNetworkListener() {
      chrome.devtools.network.onRequestFinished.removeListener(
        this.networkListenerBound
      );
      this.networkListenerBound = null;
    },
    networkListenerCallback(request) {
      if (acceptRequestTypes.indexOf(request._resourceType) >= 0) {
        //reset regex
        requestUrlRegex.lastIndex = 0;

        var regexResult = requestUrlRegex.exec(request.request.url);
        if (!regexResult || regexResult.length == 0) {
          return;
        }

        regexResult[1] = regexResult[1].replaceAll("/", ".");

        request.getContent((content) => {
          this.$emit("resourceResponse", {
            resourceName: regexResult[1],
            dataActionName: regexResult[2],
            response: JSON.parse(content).data
          });
        });
      }
    },
  },
};
</script>
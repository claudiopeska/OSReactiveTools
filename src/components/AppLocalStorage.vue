<template>
  <div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: null,
      tabId: chrome.devtools.inspectedWindow.tabId,
    };
  },
  mounted() {
    chrome.tabs.executeScript(
      this.tabId,
      { file: "./js/LocalStorageReader.js" },
      this.receiveLocalStorage.bind(this)
    );
  },
  methods: {
    receiveLocalStorage(response) {
      if(response.length){
        this.data = response[0];
        this.$emit("localStorage",this.data);
      }
    },
  },
};
</script>
<template>
  <b-container fluid class="main_app bg-light-gray">
    <b-row class="header border-bottom border-gray">
      <b-col>
        <h3>OutSystems Reactive Tools</h3>
      </b-col>
      <b-col>
        <b-form-checkbox
          v-model="analyzeSwitch.state"
          :disabled="analyzeSwitch.disabled"
          name="check-button"
          switch
          @change="toggleAnalizeSwitch"
        >
          {{ analyzeSwitch.label }}
        </b-form-checkbox>
        <!--<b-button
          size="sm"
          v-on:click="refresh"
          v-bind:disabled="analizeButton.disabled"
          ></b-button
        >-->
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
  data() {
    return {
      analyzeSwitch: {
        state: false,
        disabled: false,
        label: "Start analyzing data",
      },
    };
  },
  components: {
    resources: PageResources,
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
              chrome.devtools.inspectedWindow.reload();
              this.analyzeSwitch.label = "Analyzing data...";
            } else {
              this.analyzeSwitch.state = false;
            }
            this.analyzeSwitch.disabled = false;
          });
      } else {
        //todo: clear event
      }
    },
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
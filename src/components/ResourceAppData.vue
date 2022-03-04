<template>
  <b-tabs content-class="m-2" pills fill small>
    <b-tab title="Client Variables" active>
      <div>
        <b-row align-h="end">
          <b-form-checkbox
            v-model="onlyManMade"
            name="check-button"
            switch
            class="my-2"
            @change="toggleOnlyManMadeSwitch"
          >
            Only Man Made
          </b-form-checkbox>
        </b-row>
        <b-table
          striped
          hover
          fixed
          small
          :items="tableData"
          :fields="tableFields"
        >
          <template #cell(value)="data">
            <b-form-input
              v-if="tableData[data.index].isEdit && selectedCell === 'value'"
              type="text"
              size="sm"
              autofocus="true"
              v-model="tableData[data.index].valueEdit"
              @blur="finishCellEdit"
              @keydown.native="cancelCellEdit"
            ></b-form-input>
            <div v-else-if="data.value" @click="editCellHandler(data, 'value')">
              {{ data.value }}
            </div>
            <div
              v-else
              class="clickableCell"
              @click="editCellHandler(data, 'value')"
            ></div>
          </template>
        </b-table>
      </div>
    </b-tab>
    <b-tab title="Others">Yet still to be made...</b-tab>
  </b-tabs>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      onlyManMade: true,
      tableData: this.data,
      tableFields: [
        "name",
        {
          key: "value",
          value: "Value",
          tdClass: "text-overflow",
        },
      ],
      selectedCellData: null,
      selectedCell: null,
      tabId: chrome.devtools.inspectedWindow.tabId,
    };
  },
  mounted() {
    this.toggleOnlyManMadeSwitch();
  },
  methods: {
    editCellHandler(data, name) {
      this.closeCellEdit();
      this.selectedCellData = this.tableData[data.index];
      this.selectedCellData.valueEdit = this.selectedCellData.value;
      this.selectedCellData.isEdit = true;
      this.selectedCell = name;
    },
    closeCellEdit() {
      this.tableData = this.tableData.map((item) => ({
        ...item,
        isEdit: false,
      }));
      this.selectedCell = null;
      this.selectedCellData = null;
    },
    finishCellEdit() {
      this.selectedCellData.value = this.selectedCellData.valueEdit;
      chrome.tabs.executeScript(
        this.tabId,
        { code: "localStorage.setItem('"+this.selectedCellData.key + "','" + this.selectedCellData.value + "')" }
      );
      this.closeCellEdit();
    },
    cancelCellEdit(event) {
      if (event.which == 27) {
        this.closeCellEdit();
        event.stopPropagation();
        return;
      }
      if (event.which == 13){
        this.finishCellEdit();
        return;
      }
    },
    toggleOnlyManMadeSwitch() {
      this.tableData = this.data.filter((item) => {
        if (!this.onlyManMade) {
          return true;
        }
        return item.isManMade == this.onlyManMade;
      });
    },
    updateClientVariable() {},
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
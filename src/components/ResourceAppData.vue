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
          >
            Only Man Made
          </b-form-checkbox>
        </b-row>
        <b-table
          striped
          hover
          fixed
          small
          :items="tableClientVariables"
          :fields="tableFields"
        ></b-table>
      </div>
    </b-tab>
    <b-tab title="Others"> </b-tab>
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
      tableFields: ["name"
        ,
        {
          key: "value",
          value: "Value",
          tdClass: "text-break"
        }
        ],
    };
  },
  computed: {
    tableClientVariables() {
      return this.data.filter((item) => {
        if (!this.onlyManMade) {
          return true;
        }
        return item.isManMade == this.onlyManMade;
      });
    },
  },
};
</script>

<style>
.text-break {
  word-break: break-all;
}
</style>
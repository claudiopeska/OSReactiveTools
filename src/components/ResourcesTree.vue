<template>
  <div v-if="Object.keys(appRoot.resources).length">
    <b-input-group class="mb-2">
      <b-form-input
        v-model="searchKeyword"
        placeholder="Search"
        @change="searchTree(appRoot)"
      >
      </b-form-input>
    </b-input-group>
    <b-tree-view
      :data="treeData"
      :showIcons="true"
      :iconClassProp="icon"
      :contextMenu="false"
      @nodeSelect="selectNode"
    >
    </b-tree-view>
  </div>
  <div v-else>No Resources found...</div>
</template>

<script>
import { bTreeView } from "bootstrap-vue-treeview";
import { BuildResourcesTree } from "../js/TreeResources.js";

export default {
  components: {
    bTreeView,
  },
  props: {
    appRoot: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      searchKeyword: "",
      searchResult: null,
    };
  },
  watch: {
    appRoot: {
      deep: true,
      handler: function (newVal) {
        this.searchTree(newVal);
      },
    },
  },
  computed: {
    treeData() {
      return BuildResourcesTree(this.searchResult);
    },
  },
  methods: {
    selectNode(node, isSelected) {
      if (isSelected) {
        this.$emit("nodeSelect", node.data);
      }
    },
    searchTree(tree) {
      var lowerSearchKeyword = this.searchKeyword.trim().toLowerCase();
      
      if (lowerSearchKeyword.length == 0) {
        //restore original values
        this.searchResult = tree;
        return;
      }

      var result = {};

      Object.entries(tree.resources).forEach(([rkey, rvalue]) => {
        if (rkey.toLowerCase().indexOf(lowerSearchKeyword) != -1) {
          result[rkey] = rvalue;
          return;
        }

        Object.entries(rvalue.dataActions).forEach(([dakey, davalue]) => {
          if (dakey.toLowerCase().indexOf(lowerSearchKeyword) != -1) {
            if (!result[rkey]) {
              result[rkey] = { ...rvalue };
              result[rkey].dataActions = {};
            }
            result[rkey].dataActions[dakey] = davalue;
          }
        });
      });
      
      this.searchResult = {
        data: tree.data,
        resources: result
      };
    },
  },
};
</script>

<style>
.tree-branch {
  padding: 0.25rem 0 0.25rem 0;
}
</style>
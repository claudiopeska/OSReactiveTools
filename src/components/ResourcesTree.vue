<template>
  <div v-if="data">
    <b-input-group class="mb-2">
      <b-form-input
        v-model="searchKeyword"
        placeholder="Search"
        @change="searchTree"
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
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      searchKeyword: null,
    };
  },
  computed: {
    treeData(){
      return BuildResourcesTree(this.data);
    }
  },
  methods: {
    selectNode(node, isSelected) {
      if (isSelected) {
        this.$emit("nodeSelect", node.data);
      }
    },
    searchTree() {
      /*var lowerSearchKeyword = this.searchKeyword.trim().toLowerCase();
      if (lowerSearchKeyword.length == 0) {
        this.treeData = this.buildTreeData(this.data);
        return;
      }

      var searchResult = {};

      Object.entries(this.resources).forEach(([rkey, rvalue]) => {
        if (rkey.toLowerCase().indexOf(lowerSearchKeyword) != -1) {
          searchResult[rkey] = rvalue;
          return;
        }

        Object.entries(rvalue.dataActions).forEach(([dakey, davalue]) => {
          if (dakey.toLowerCase().indexOf(lowerSearchKeyword) != -1) {
            if (!searchResult[rkey]) {
              searchResult[rkey] = { ...rvalue };
              searchResult[rkey].dataActions = {};
            }
            searchResult[rkey].dataActions[dakey] = davalue;
          }
        });
      });
      this.treeData = this.buildTreeData(searchResult);*/
    },
  },
};
</script>

<style>
.tree-branch {
  padding: 0.25rem 0 0.25rem 0;
}
</style>
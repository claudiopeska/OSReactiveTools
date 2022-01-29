<template>
  <!--INCLUDE TREE SEARCH FOR ANY NODE-->
  <b-row class="full-height p-2">
    <b-col class="section border-right">
      <div v-if="treeData">
        <b-input-group class="mb-2">
          <b-form-input
            v-model="searchKeyword"
            placeholder="Search"
            @change="searchTree"
          ></b-form-input>
        </b-input-group>
        <b-tree-view
          :data="treeData"
          :showIcons="true"
          :iconClassProp="icon"
          :contextMenu="false"
          @nodeSelect="appNodeSelect"
        ></b-tree-view>
      </div>
      <div v-else>No Resources found...</div>
    </b-col>
    <b-col class="section">
      <!--Later when showing JSON also allow some search-->
      <div v-if="selectedNode">
        <div v-if="Array.isArray(selectedNode)">
          <b-tree-view
            :data="selectedNode"
            :showIcons="true"
            :iconClassProp="icon"
            :contextMenu="false"
            @nodeSelect="appNodeSelect"
          ></b-tree-view>
        </div>
        <div v-else-if="selectedNode.data"><json-view :data="selectedNode.data" :maxDepth="1" /></div>
        <div v-else>No data yet</div>
      </div>
      <div v-else>No node selected</div>
    </b-col>
  </b-row>
</template>

<script src="../js/PageResources.js"></script>

<style>
.tree-branch {
  padding: 0.25rem 0 0.25rem 0;
}

.section {
  height: 100%;
  overflow-y: auto;
}
</style>
<template>
  <!--INCLUDE TREE SEARCH FOR ANY NODE-->
  <b-row class="full-height p-2">
    <b-col class="section border-right">
      <div v-if="treeData">
        <b-input-group class="mb-2">
          <b-form-input
            v-model="searchKeyword"
            placeholder="Search"
            @change="searchTree">
          </b-form-input>
        </b-input-group>
        <b-tree-view
          :data="treeData"
          :showIcons="true"
          :iconClassProp="icon"
          :contextMenu="false"
          @nodeSelect="appNodeSelect">
        </b-tree-view>
      </div>
      <div v-else>No Resources found...</div>
    </b-col>
    <b-col class="section">
      <!--Later when showing JSON also allow some search-->
      <div v-if="selectedNode">
        <div v-if="selectedNode.data">
          <b-row class="mb-2">
            <b-col class="font-weight-bold">
              <i v-bind:class="selectedNode.icon"></i>
              {{ selectedNode.name }}
            </b-col>
            <b-col cols="auto">
              <b-button
                size="sm"
                variant="info"
                v-on:click="openResourceAction">
                Go to Source
              </b-button>
            </b-col>
          </b-row>
          <div v-if="selectedNode.data.response">
            <b-tabs content-class="m-2" pills fill small>
              <b-tab title="Preview" active>
                <json-view :data="selectedNode.data.response" :maxDepth="1" />
              </b-tab>
              <b-tab title="Response">
                <div class="position-relative">
                  <b-button
                    class="copyToClipboard"
                    size="sm"
                    variant="secondary"
                    v-on:click="copyToClipboard">
                      <i class="bi-clipboard"></i>
                  </b-button>
                  <b-form-textarea 
                    v-model="selectedNode.data.response"
                    ref="textjson" 
                    v-on:focus="$event.target.select()"
                    readonly 
                    max-rows="99999" 
                    no-auto-shrink 
                    no-resize="true" 
                  />
                </div>
              </b-tab>
            </b-tabs>
          </div>
          <div v-else><b-col>No data yet</b-col></div>
        </div>
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

.position-relative{
  position: relative;
}

.copyToClipboard{
  position: absolute;
  right: 10px;
  top: 10px
}

</style>
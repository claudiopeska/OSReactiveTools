<template>
  <div class="resources">
    <b-tree-view :data="treeData" :showIcons="true" :iconClassProp="icon"></b-tree-view>
    <div v-for="(value, name) in resources" :key="name">
      <b-card v-bind:sub-title="value.name" class="m-1">
        <b-card-text>{{ name }}</b-card-text>
      </b-card>
    </div>
  </div>
</template>

<script src="../js/PageResources.js"></script>
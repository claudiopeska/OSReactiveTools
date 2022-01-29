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
        ></b-tree-view>
      </div>
      <div v-else>
        No Resources found...
      </div>
    </b-col>
    <b-col class="section">
      <!--Later when showing JSON also allow some search-->
      {{ resources }}
      <!--Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam in metus
      sed nisl blandit eleifend non et quam. Donec efficitur ultricies nisi, in
      semper erat ultricies porta. Phasellus dignissim cursus eros, ac faucibus
      ligula eleifend ut. Sed non elit magna. Mauris quis semper libero, eget
      hendrerit augue. Morbi molestie venenatis metus eu pretium. Vivamus vel
      ultricies est. Proin pharetra varius sem quis mollis. Aliquam quis enim
      nec eros sollicitudin tristique at eu lorem. Nam faucibus velit sit amet
      purus dignissim imperdiet. Pellentesque vehicula arcu nibh, et faucibus
      ante ornare vitae. Praesent eleifend lorem vel semper malesuada. Phasellus
      posuere odio enim, ut gravida diam congue et. Interdum et malesuada fames
      ac ante ipsum primis in faucibus. Sed hendrerit sollicitudin ante, vel
      vulputate ex. Sed malesuada, eros at elementum cursus, lacus nisl mollis
      elit, sed dignissim lectus elit eu ante. In eget lectus orci. Curabitur
      ornare lacus elit, semper ultricies lectus venenatis rhoncus. Nam non
      porta purus, nec auctor ex. Class aptent taciti sociosqu ad litora
      torquent per conubia nostra, per inceptos himenaeos. In accumsan sapien ac
      arcu dapibus scelerisque. Nunc erat lectus, sagittis at dictum eget,
      luctus ut dui. Etiam mattis tortor leo, ac hendrerit neque eleifend vitae.
      Curabitur sit amet ornare lacus. Fusce mattis placerat elit. Suspendisse
      potenti. Cras posuere placerat purus, eu porta massa aliquet a. Duis vel
      suscipit justo, sed rhoncus arcu. Curabitur fermentum luctus turpis, quis
      blandit justo consectetur vitae. Donec sed sapien ornare, tincidunt augue
      eget, interdum nibh. Quisque a ultricies ligula. Nulla eu eros ipsum.
      Nullam vel leo lorem. Vestibulum efficitur ex augue, in mollis lectus
      efficitur in.-->
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
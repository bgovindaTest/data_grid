<template>
  <Header />
  <QueryParams />
</template>

<script>
/*
Header
Grid
Placholders
SubModal
*/


import Header from "./components/Header";
import QueryParams from "./components/QueryParams/";

export default {
  name: "App",
  // data() {
  //   return {
  //     columnDefs: null,
  //     rowData: null,
  //   };
  // },
  components: {
    "Header":Header,
    "QueryParams": QueryParams
  },
};
</script>

<style lang="scss">
  // @import "~ag-grid-community/dist/styles/ag-grid.css";
  // @import "~ag-grid-community/dist/styles/ag-theme-alpine.css";
  * { margin: 0 }
</style>
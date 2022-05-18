<template>
  <!-- <Header /> -->
  <QueryParams />
</template>

<script>
/*
Header
Grid
Placholders
SubModal
*/


// import Header from "./components/Header";
import QueryParams from "./components/QueryParams/OrderBy/";

export default {
  name: "App",
  // data() {
  //   return {
  //     columnDefs: null,
  //     rowData: null,
  //   };
  // },
  components: {
    // "Header":Header,
    "QueryParams": QueryParams
  },
};
</script>
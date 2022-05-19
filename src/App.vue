<template>

<Filter />



</template>

<script>
/*
Header
Grid
Placholders
SubModal
*/


// import Header from "./components/Header";
import OrderParams from "./components/QueryParams/OrderBy/";
import FilterParams from "./components/QueryParams/Filter/";
// import BulmaTest from "./components/BulmaTest.vue"

export default {
  name: "App",
  // data() {
  //   return {
  //     columnDefs: null,
  //     rowData: null,
  //   };
  // },
  components: {
    "OrderParams": OrderParams,
    "Filter": FilterParams
  },
};
</script>

<style lang='scss'>
@import '@/assets/vue_modal';
@import '@/assets/bulma.scss';




</style>
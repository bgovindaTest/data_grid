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
import flatPickr from 'vue-flatpickr-component';
// import 'flatpickr/dist/flatpickr.css';


export default {
  name: "App",
  data() {
    return {
      date: null,
      columnDefs: null,
      config: {
        altInputClass: "input"
      },
      rowData: null,
    };
  },
    // components: { flatPickr },

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
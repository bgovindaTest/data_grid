<template>
<div>

<font-awesome-icon :icon="['fas', 'angle-down']" color="red" filter="brightness(50%)"/>
<font-awesome-icon :icon="['fas', 'angle-down']" color="red" filter="brightness(500%)" style="background-color:blue"/>
<button >  <font-awesome-icon :icon="['fas', 'undo']" /> </button>
<button @click="is_deleted = !is_deleted" > 
  
  <font-awesome-icon :icon="['far', 'trash-alt']" v-if="is_deleted" />   
  <font-awesome-icon :icon="['fas', 'trash-alt']" v-else /> 
  
  
</button>

<!-- <button @click="showModal = !showModal"> modal </button>

<Modal v-model="showModal" modal-class="fullscreen-modal" title="My first modal"> -->
  <!-- <Filter /> -->
<!-- </Modal> -->



</div>

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
import VueModal from '@kouts/vue-modal'

export default {
  name: "App",
  data() {
    return {
      date: null,
      is_deleted: false,
      columnDefs: null,
      config: {
        altInputClass: "input"
      },
      rowData: null,
      showModal: false
    };
  },
    // components: { flatPickr },

  components: {
    "OrderParams": OrderParams,
    "Filter": FilterParams,
    'Modal': VueModal,
  },
};
</script>

<style lang='scss'>
@import '@/assets/vue_modal';
@import '@/assets/bulma.scss';






</style>
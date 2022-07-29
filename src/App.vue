<template>
<div>




<div v-if="loading">
  <!-- error msg change color display message i.e. permission denied contact xyz -->
  <page-loader />
</div>
<div v-else>
  <order-by :orderByParams="orderByParams"/>
</div>


  <!-- <order-by :orderByParams="orderByParams"/> -->

  <!-- <grid-header 
    @help="Log()"
    :page_number="page_number"
  />
  <ag-grid-vue
    style="width: 100%; height: calc(100vh - 3.25rem)"
    class="ag-theme-alpine"
    :columnDefs="columnDefs"
    :rowData="tableData"
    @grid-ready="onGridReady"
  /> -->

  <!-- <h1>hola</h1>
    @grid-ready="onGridReady"

    @help="console.log('help from main')"


  <button @click="bxc()"> nada </button>
  <div>
    <button @click="json_pholder()"> call </button>
    <div>{{ph}}</div>
  </div> -->
  <!-- <PageLoader /> -->
 <!-- <grid-header /> -->
  <!-- <button @click="grid_hello">grid hello </button>


  </ag-grid-vue>
    <Modal v-model="modalx.modal1" modal-class="fullscreen-modal" title="My first modal">
        <ag-grid-vue
          style="width: 100%; height: 100%"
          class="ag-theme-alpine"
          :columnDefs="columnDefs2"
          :rowData="rowData2"
        >
        </ag-grid-vue>
    </Modal> -->

</div>
</template>

<script>
import { AgGridVue } from "ag-grid-vue3";
// import VueModal from '@kouts/vue-modal'
import AutoCompleteEditor from "./components/GridEditors/AutoCompleteEditor"
import DateTimeEditor   from "./components/GridEditors/DateTimeSelector"
import crudSelectEditor from "./components/GridEditors/CrudSelectEditor"
// import SubGridSelector from "./components/GridEditors/SubGridSelector"
import GridHeader from "./components/Header"

/*
Modals
*/
import OrderBy    from "./components/OrderBy"
import Help       from "./components/Help"
import PageLoader from "./components/PageLoader"

//main mixin
import grid_controller from "@/mixins/grid_controller"


export default {
  name: "App",
  mixins: [grid_controller],
  components: {
    "ag-grid-vue":AgGridVue,
    "autoCompleteEditor": AutoCompleteEditor,
    "dateTimeEditor":   DateTimeEditor,
    "crudSelectEditor": crudSelectEditor,
    // // "subGridSelector": SubGridSelector,
    "grid-header": GridHeader,
    // "Modal": VueModal,
    "order-by": OrderBy,
    "help": Help,
    'page-loader': PageLoader
  },
  methods: {
    Log() {
      console.log('help from main')
    }
  },

  async mounted () {
      /*
      This object is ran to initialize all the required data from the server. When all initial loading is complete the 
      main page with the nav bar, grid and footer will be displayed. The order of the initializations matter.

      MainPage
          1. GetRoute
          2. Pull Configuration
          3. Pull and create ValueObject
          4. Parse Grid Configurations
          5. TurnLoading off
          6. Load Table Data
      SubPage
          1. Parse Sub Grid Configurations
          2. Turn Loading off
          3. LoadData

      */
      this.MainGridInit()
      // await new Promise(r => setTimeout(r, 1000))
      this.loading = false
  }


};






</script>

<style lang="scss">
  @import "~ag-grid-community/dist/styles/ag-grid.css";
  @import "~ag-grid-community/dist/styles/ag-theme-alpine.css";
  @import "./assets/bulma.scss";

  * { margin: 0 }


</style>
<template>
<div>
  <ag-grid-vue
    style="width: 100%; height: calc(100vh - 3.25rem)"
    class="ag-theme-alpine"
    :columnDefs="columnDefs"
    :rowData="tableData"
    @grid-ready="onGridReady"
  />

  <!-- <h1>hola</h1>
    @grid-ready="onGridReady"

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
// import GridHeader from "./components/GridLayout/Header"

import grid_controller from "@/mixins/grid_controller"
export default {
  name: "App",
  mixins: [grid_controller],
  components: {
    "ag-grid-vue":AgGridVue,
    "autoCompleteEditor": AutoCompleteEditor,
    "dateTimeEditor":   DateTimeEditor,
    "crudSelectEditor": crudSelectEditor
    // // "subGridSelector": SubGridSelector,
    // "grid-header": GridHeader,
    // "Modal": VueModal
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
      //if submodal else.
      // if (this.is_development) {

      // }
      // this.RunColumnDefsInit()
      this.MainGridInit()
  }


};






</script>

<style lang="scss">
  @import "~ag-grid-community/dist/styles/ag-grid.css";
  @import "~ag-grid-community/dist/styles/ag-theme-alpine.css";

.rag-red {
  background-color: lightcoral;
}
.rag-green {
  background-color: lightgreen;
}
.rag-amber {
  background-color: lightsalmon;
}

.rag-red-outer .rag-element {
  background-color: lightcoral;
}

.rag-green-outer .rag-element {
  background-color: lightgreen;
}

.rag-amber-outer .rag-element {
  background-color: lightsalmon;
}


  * { margin: 0 }


</style>
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
// import AutoComplete from "./components/GridEditors/AutoComplete"
// import DateSelector from "./components/GridEditors/DateSelector"
import crudSelectEditor from "./components/GridEditors/CrudSelectEditor"
// import SubGridSelector from "./components/GridEditors/SubGridSelector"
// import GridHeader from "./components/GridLayout/Header"

// let cellClassRules = {}
//     cellClassRules['editable_pass_style']       = params => false
//     cellClassRules['editable_error_style']      = params => false
//     cellClassRules['non_editable_pass_style']   = params => false
//     cellClassRules['non_editable_error_style']  = params => true

// const ragCellClassRules = {
//   'rag-green-outer': (params) => params.value === 2008,
//   'rag-amber-outer': (params) => params.value === 2004,
//   'rag-red-outer': (params) => params.value === 2000,
// };


import grid_controller from "@/mixins/grid_controller"
export default {
  name: "App",
  mixins: [grid_controller],
  // data () {
  //   return {
  //     gridApi: null,
  //     columnApi: null,
  //     gridOptions: null,
  //     columnDefs: [{
  //           field: 'year',

  //     // cellStyle: params => {
  //     //     if ( params.value === 2008) {
  //     //         //mark police cells as red
  //     //         return {color: 'red', backgroundColor: 'green'};
  //     //     }
  //     //     return null;
  //     // }

  //     cellClass: function(params) { return '.rag-green'; }


  //     }],
  //     tableData: [{'year':2008}, {'year':2004}]
  //   }
  // },



  components: {
    "ag-grid-vue":AgGridVue,
    // "autoComplete": AutoComplete,
    // "dateSelector": DateSelector,
    "crudSelectEditor": crudSelectEditor
    // "deleteUndoSelector": DeleteUndoSelector,
    // // "subGridSelector": SubGridSelector,
    // "grid-header": GridHeader,
    // "Modal": VueModal
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
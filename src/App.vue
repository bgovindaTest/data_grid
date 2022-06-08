<template>
<div>
  <grid-header/>
  <ag-grid-vue
    style="width: 100%; height: calc(100vh - 3.25rem)"
    class="ag-theme-alpine"
    :columnDefs="columnDefs"
    :rowData="rowData"
    @cell-value-changed="onCellValueChanged"
    @grid-ready="onGridReady"
  />

  <!-- <h1>hola</h1>
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
import VueModal from '@kouts/vue-modal'
import AutoComplete from "./components/GridEditors/AutoComplete"
import DateSelector from "./components/GridEditors/DateSelector"
import DeleteUndoSelector from "./components/GridEditors/DeleteUndoSelector"
import SubGridSelector from "./components/GridEditors/SubGridSelector"
import GridHeader from "./components/GridLayout/Header"

import grid_mixin from "@/mixins/grid_mixin"
export default {
  name: "App",
  mixins: [grid_mixin],
  data() {
    return {
      columnDefs: null,
      rowData: null,
      showModal:true,
      modalx: {modal1: false},
      api: null,
      columnApi: null
    };
  },
  methods: {
    onCellValueChanged(event) {
      console.log(event)
    },
    onGridReady: function (params) {
      this.api = params.api;
      this.columnApi = params.columnApi;      
    },
  },

  components: {
    "ag-grid-vue":AgGridVue,
    "autoComplete": AutoComplete,
    "dateSelector": DateSelector,
    "deleteUndoSelector": DeleteUndoSelector,
    // "subGridSelector": SubGridSelector,
    "grid-header": GridHeader,
    "Modal": VueModal
  },
  beforeMount() {
    let debugConfig = this.LoadDebugParams()
    let columnDefs = debugConfig.page[0].columnDefs
    let rowData = debugConfig.page[0].rowData
    this.columnDefs = columnDefs
    this.rowData = rowData
  },
};


</script>

<style lang="scss">
  @import "~ag-grid-community/dist/styles/ag-grid.css";
  @import "~ag-grid-community/dist/styles/ag-theme-alpine.css";
  @import "@/assets/bulma.scss";
  @import "@/assets/vue_modal.scss";
  * { margin: 0 }


</style>
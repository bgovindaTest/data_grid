<template>

  <ag-grid-vue
    style="width: 100%; height: calc(100vh - 3.25rem)"
    class="ag-theme-alpine"
    :columnDefs="columnDefs"
    :rowData="rowData"
    @cell-value-changed="onCellValueChanged"
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


</template>

<script>
import { AgGridVue } from "ag-grid-vue3";
// import AutoComplete from "./components/GridEditors/AutoComplete"
// import DateSelector from "./components/GridEditors/DateSelector"
// import DeleteUndoSelector from "./components/GridEditors/DeleteUndoSelector"
// import SubGridSelector from "./components/GridEditors/SubGridSelector"
// import GridHeader from "./components/GridLayout/Header"
// import VueModal from '@kouts/vue-modal'
// import grid_mix from '@/mixins/grid.js'
// import PageLoader from '@/components/GridLayout/PageLoader'


//loads main page
//async other components?
//creates columnDef array object

export default {
  name: "App",
  // mixins: [grid_mix],
  data() {
    return {
      bx: null,
      columnDefs: null,
      rowData: null,
      columnDefs2: null,
      rowData2: null,
      showModal:true,
      count: 1,
      ph: 'hola',
      modalx: {modal1: false}




    };
  },
  methods: {
    bxc() { 
      this.bx = $route; //.query.page;
      console.log(this.bx)
    }

  },
  methods: {
    onCellValueChanged(event) {

      console.log(event)
      // event.data['bool'] = false
      // event.api.refreshCells()
    },
    async json_pholder () {
      let x = this.count
      this.count +=1
      // let rx = `https://jsonplaceholder.typicode.com/todos/${x}`
      let rx = '/' + String(x)
      console.log(rx)
      let response = await this.axios.get(rx)
      let data = response.data
      this.ph = data

    }
  },

  components: {
    "ag-grid-vue":AgGridVue,
    // "autoComplete": AutoComplete,
    // "dateSelector": DateSelector,
    // "deleteUndoSelector": DeleteUndoSelector,
    // // "subGridSelector": SubGridSelector,
    // "grid-header": GridHeader,
    // "Modal": VueModal,
    // "PageLoader": PageLoader
  },
  beforeMount() {

    this.columnDefs = [
      // { field: "sub_grid",
      //   cellRenderer: "subGridSelector"
      // },      
      { field: "make" },
      { field: "model" },
      { field: "price", editable: true },
      {
            headerName: "Doubling",
            field: "number",
            //cellEditor: "doublingEditor",
            // cellEditor: "autoComplete",
            // cellEditorParams: {
            //     return_value: 'appointment_code',
            //     //display_value
            //     //crud_value:
            //     column_info: [
            //         {header: "id" , init_width: 50},
            //         {header: "name", init_width: 50},
            //         {header: "username", init_width: 75 },
            //         {header: "email", init_width: 200 },
            //         {header: "phone", init_width: 150 },
            //         {header: "website", init_width: 100 }
            //     ]
            // },


            editable: true,
            width: 300
      },
      {field: "date", editable:true},//, cellEditor: "dateSelector" },
      {
          field: 'lang',
          editable: true,
          // cellEditor: 'agRichSelectCellEditor',
          // cellEditorParams: {
          //     values: ['English', 'Spanish', 'French', 'Portuguese', '(other)'],
          // }
        // ...other props
      },
      { field: "bool" },


    ];

    this.rowData = [
      { make: "Toyota", model: "Celica", price: 35000, number: 1, date: 'abcde', lang: null, bool: true },//, "meta": this.modalx },
      { make: "Ford", model: "Mondeo", price: 32000, number: 2, date: null, lang: null, bool: true},// , "meta": this.modalx },
      { make: "Porsche", model: "Boxster", price: 72000, number: 3, date: null, lang: null, bool: true},// , "meta": this.modalx },
    ],

    this.columnDefs2 = [{ field: "yolo" }],
    this.rowData2 = [ {"yolo": 1}, {'yolo': 2}, {"yolo": 3} ]


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
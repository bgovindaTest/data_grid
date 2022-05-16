<template>
  <ag-grid-vue
    style="width: 100%; height: 100vh"
    class="ag-theme-alpine"
    :columnDefs="columnDefs"
    :rowData="rowData"
  >
  </ag-grid-vue>
</template>

<script>
import { AgGridVue } from "ag-grid-vue3";

export default {
  name: "App",
  data() {
    return {
      columnDefs: null,
      rowData: null,
    };
  },
  components: {
    "ag-grid-vue":AgGridVue
  },
  beforeMount() {
    this.columnDefs = [
      { field: "price", editable: true },
      {
            headerName: "Doubling",
            field: "number",
            editable: true,
            width: 300
      },
      {field: "date", editable:true, cellEditor: "dateSelector" },
      {
          headerName: 'LANG',
          field: 'lang',
          editable: true,
          cellEditor: 'agRichSelectCellEditor',
          cellEditorParams: {
              values: [null,'English', 'Spanish', 'French', 'Portuguese', '(other)'],
          },
          my_params: true,

        // ...other props
          cellStyle: function (params) {
              console.log(params.colDef)
              console.log(params)
              if (params.value === 'English') {
                  //mark police cells as red
                  return {color: 'red', backgroundColor: 'green'};
              }
              return {color: '', backgroundColor: ''};
          }
      },
      //is_valid:
      //is_editable:



    ];

    this.rowData = [
      { price: 35000, number: 1, date: 'abcde', lang: null },
      {  price: 32000, number: 2, date: null, lang: null },
      {  price: 72000, number: 3, date: null, lang: null },
    ];
  },
};
</script>

<style lang="scss">
  @import "~ag-grid-community/dist/styles/ag-grid.css";
  @import "~ag-grid-community/dist/styles/ag-theme-alpine.css";
  * { margin: 0 }
</style>
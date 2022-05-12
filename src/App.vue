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
import AutoComplete from "./components/AutoComplete"
import DateSelector from "./components/DateSelector"

export default {
  name: "App",
  data() {
    return {
      columnDefs: null,
      rowData: null,
    };
  },
  components: {
    "ag-grid-vue":AgGridVue,
    "autoComplete": AutoComplete,
    "dateSelector": DateSelector
  },
  beforeMount() {
    this.columnDefs = [
      { field: "make" },
      { field: "model" },
      { field: "price", editable: true },
      {
            headerName: "Doubling",
            field: "number",
            //cellEditor: "doublingEditor",
            cellEditor: "autoComplete",
            editable: true,
            width: 300
      },
      {field: "date", editable:true, cellEditor: "dateSelector" },
      {
          field: 'lang',
          editable: true,
          cellEditor: 'agRichSelectCellEditor',
          cellEditorParams: {
              values: ['English', 'Spanish', 'French', 'Portuguese', '(other)'],
          }
        // ...other props
      }



    ];

    this.rowData = [
      { make: "Toyota", model: "Celica", price: 35000, number: 1, date: 'abcde', lang: null },
      { make: "Ford", model: "Mondeo", price: 32000, number: 2, date: null, lang: null },
      { make: "Porsche", model: "Boxster", price: 72000, number: 3, date: null, lang: null },
    ];
  },
};
</script>

<style lang="scss">
  @import "~ag-grid-community/dist/styles/ag-grid.css";
  @import "~ag-grid-community/dist/styles/ag-theme-alpine.css";
  * { margin: 0 }
</style>
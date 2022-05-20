<!--
This module is responsible for initializing the data parameters and functions required for the autocomplet widget.
Each grid_column_rule has the structure below. A more indepth description is in ./library/grid_rules.js
  {
    field: 'field_name
    cellEditorFramework: 'AutocompleteAg'
    cellEditorParams: {
        selectValues: selectValues,
        return_value: 'appointment_code', (return_value is used as key)
        column_info: [
            {header: "id" , init_width: 50},
            {header: "name", init_width: 50},
            {header: "username", init_width: 75 },
            {header: "email", init_width: 200 },
            {header: "phone", init_width: 150 },
            {header: "website", init_width: 100 }
        ]
        match_string: (string) default __match_string__
        match_string_function: function?
        map_route: string
        map_params: {} 
        crud_value: 'id'
        map_function: //the map function is place here during initialization
        return_field: ""
    }
The cellEditorFramework must be equal to 'AutocompleteAg' This tells the grid which input format to use.
selectValues: is the array that contains all the data and return values for the autocomplete column and related calculated fields. The data can be 
    initialized in each ./pages/xxx.vue if no map_route is defined i.e. !grid_row_rule.hasOwnProperty('map_route') this will be left unchanged. 
    Otherwise this will be overwritten by data from the server.
return_value: this is a name of a unique column in selectValues. This is whats returned by the autocomplete. Its also used as the key
    in the created maping function that allows calculated columns to generate values based on the return value inputed in a cell
match_string: the name appended to selectValues and search by the autocomplete widget. the input is searched against this column.
    in general its a concatenation of all the columns
map_string_function: a function provided in the form function (select_value_row) { //concatenate columns return select_value_row[map_string_name]}
    this function allows for custom function to create match string. Otherwise all columns are concatenated together and spacing is removed.
map_route: this is the route either full i.e. localhost:3000/mapdata/appointments or relatvie /mapdata/appointments. This is the rest route
    to extract the selectValues array. 
map_params: this is an object. If provided can send paramters along with the map_route to determine how to filter out the map_route.
crud_value: 
map_function:
return_field: this is the name of the column that the data will be saved to. Its used when the name of the column being pulled is different then the
    save column. For example, classification_name i.e. App or Physician is the value displayed and used for the autocomplete, however in the providers
    table the value is stored as classification_id. So in this example field would be classification_name and return_field would be classification_id

Inputs:
grid_column_rules: Array of grid_column_rule
autocomplete_map: this object is sent from the main_page.vue it will store all the autocomplete information used by AutocompleteAg and corresponding
    calculated functions
axios_object: This is the axios module. Its passed from the main_page.vue. This allows for cals to be made to the server.
grid_params: This contains additional information and functions for initializing the data grid. Here it will be used to send data to the user
    to update on the status of loading data. If and error occurs this module throws and error.

axios return object
{ 'error_msg': err_msg, 'is_error': true, 'rows': [], 'table_name': table_name, 'route_name': route_name }

Returns:
autocomplete_map[field] -> {'selectValues': [{}], 'mapFunction': map_function, 'key': return_value, 'crud_value', crud_value }
-->


<template>



  <div ref="autoCompleteArea" :style="{ width: gridWidth + 'px' }" >
    <input
      ref="input"
      v-model="value"
      style=" height: 28px; font-weight: 400; font-size: 12px;"
      :style="{ width: params.column.actualWidth + 'px' }"
        @keydown.down = 'onKeydown'
        @keydown.up = 'onKeydown'
        @keydown.enter = 'onKeydown'
        @input = 'change'

    />
    <ag-grid-vue
      style="font-weight: 150;"
      :style="{ height: gridHeight + 'px', 'max-width': gridWidth + 'px' }"
      class="ag-theme-alpine"
      :columnDefs="columnDefs"
      :rowData="rowData"
      :rowSelection="rowSelection"
      @gridReady="onGridReady($event)"
      @rowClicked="rowClicked($event)"
      @keydown.down = 'onKeydown'
      @keydown.up = 'onKeydown'

      @keydown.enter = 'onKeydown'

      @keydown = 'onKeydown'

    ></ag-grid-vue>
  </div>
</template>

<script>
import { AgGridVue } from "ag-grid-vue3";
//   @gridReady="onGridReady($event)"

export default {
 
   data() {
       return {
            gridApi: null,
            value: null,
            queryChars: 2,
            gridHeight: 175,
            gridWidth: 375,
            rowSelection: "single",
            propertyName: 'x',
            columnDefs: [
                { field: "x" },
                { field: "y" },
            ],

            rowData: [
                { x: "Toyota",  y: "Celica"},
                { x: "Ford",    y: "Mondeo"},
                { x: "Porsche", y: "Boxster"},
                { x: "Brandon", y: "G"},
                { x: "Kim", y: "K"},
            ]
       }
    },

  components: {
    "ag-grid-vue":AgGridVue
  },

//   watch: {
//     inputValue(val) {
//       this.processDataInput(val);
//     },
//   },


   methods: {
       /* Component Editor Lifecycle methods */
       // the final value to send to the grid, on completion of editing
        getValue() {
            // this simple editor doubles any value entered into the input
            return this.value;
        },

        isPopup() { return true; },


        // Gets called once before editing starts, to give editor a chance to
        // cancel the editing before it even starts.
        isCancelBeforeStart() {
            return false;//false;
        },

        // Gets called once when editing is finished (eg if Enter is pressed).
        // If you return true, then the result of the edit will be ignored.
        isCancelAfterEnd() {
            // our editor will reject any value greater than 1000
            return this.value > 1000;
        },

        rowConfirmed() {
            let x = this.gridApi.getSelectedRows()[0]
            console.log( x )
            console.log( this.gridApi.getDisplayedRowAtIndex(0) )
            //if x is undefined?



            if (this.gridApi.getSelectedRows()[0]) {
                this.selectedObject = this.gridApi.getSelectedRows()[0];
                this.isCanceled = false;
                this.value = this.selectedObject['x']
                console.log(this.value)
            }
            //get firs row_data field?
            this.params.api.stopEditing();
            // this.$refs.autoCompleteArea.removeEventListener("keydown", () => null);
        },


        rowClicked(event) {
            this.selectedObject = event.data;
            this.value = this.selectedObject['x']
            this.isCanceled = false;
            this.params.api.stopEditing();
        },

        onGridReady(event) {
            this.gridApi = event.api;
            // this.gridApi.sizeColumnsToFit();
            // this.columnFilter = this.gridApi.getFilterInstance(this.propertyName);
            //if available?
            this.gridApi.getDisplayedRowAtIndex(0).setSelected(true);
            this.gridApi.ensureIndexVisible(0, "top");
            // console.log(this.gridApi.setQuickFilter)

        },

        navigateGrid() {
            if (
            this.gridApi.getFocusedCell() == null ||
            this.gridApi.getDisplayedRowAtIndex(
                this.gridApi.getFocusedCell().rowIndex
            ) == null
            ) {
            // check if no cell has focus, or if focused cell is filtered
            this.gridApi.setFocusedCell(
                this.gridApi.getDisplayedRowAtIndex(0).rowIndex,
                this.propertyName
            );
            this.gridApi
                .getDisplayedRowAtIndex(this.gridApi.getFocusedCell().rowIndex)
                .setSelected(true);
            } else {
            this.gridApi.setFocusedCell(
                this.gridApi.getFocusedCell().rowIndex,
                this.propertyName
            );
            this.gridApi
                .getDisplayedRowAtIndex(this.gridApi.getFocusedCell().rowIndex)
                .setSelected(true);
            }
        },



        onKeydown(event) {

            console.log(event)
            if (event.key == "ArrowLeft" || event.key == "ArrowRight") { return false; }



            event.stopPropagation();
            //determine focus?
            // console.log(event.key)

            if (event.key == "Escape") {
                this.params.api.stopEditing();
                // this.$refs.autoCompleteArea.removeEventListener("keydown", () => null);
                return false;
            }
            if (event.key == "Enter" || event.key == "Tab") {
                this.rowConfirmed();
                return false;
            }
            if (event.key == "ArrowUp" || event.key == "ArrowDown") {
                this.navigateGrid();
                return false;
            }
            else {
                this.$refs.input.focus()
            }
        },



    change() {
        console.log('change')
        this.gridApi.setQuickFilter(this.value)

        this.gridApi.getDisplayedRowAtIndex(0).setSelected(true);
        this.gridApi.ensureIndexVisible(0, "top");


    },

    updateFilter() {
      if (this.columnFilter && this.gridApi) {
        this.columnFilter.setModel({
          type: "startsWith",
          filter: this.inputValue,
        });
        this.columnFilter.onFilterChanged();
        if (this.gridApi.getDisplayedRowAtIndex(0)) {
          this.gridApi.getDisplayedRowAtIndex(0).setSelected(true);
          this.gridApi.ensureIndexVisible(0, "top");
        } else {
          this.gridApi.deselectAll();
        }
      }
    },


    //setFirstRow
    //debounce
    //xyz

   },
   mounted() {
        this.input = this.$refs.input;

        this.value = this.params.value;


        if (this.params.key == "Backspace") {
            this.value = ""
        } else if (this.params.key == "Delete") {
            this.value = ""
        } else if (this.params.charPress !== null ) {
            this.value = this.params.charPress
        }

        this.$nextTick(() => 
        {
            this.$refs.input.focus()

        }

        
        
        
        );
   }


}

// cellEditingStopped(event) {
//     this.gridApi.setFocusedCell(event.rowIndex, event.colDef.field);
// }

//   <ag-grid-angular 
//     style="height: 300px; width: 600px;" 
//     class="ag-theme-balham"
//     [rowData]="rowData" 
//     [columnDefs]="columnDefs"
//     [frameworkComponents]="frameworkComponents"
//     (gridReady)="onGridReady($event)"
//     (cellEditingStopped)="cellEditingStopped($event)"
//     >
//   </ag-grid-angular>


</script>


<style lang="scss">
  @import "~ag-grid-community/dist/styles/ag-grid.css";
  @import "~ag-grid-community/dist/styles/ag-theme-alpine.css";
</style>
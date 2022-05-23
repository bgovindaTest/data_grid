<!--
This module is responsible for initializing the data parameters and functions required for the autocomplet widget.
Each grid_column_rule has the structure below. A more indepth description is in ./library/grid_rules.js
  {
    field: 'field_name,
    data_type: 
    cellEditorFramework: "autoComplete"
    cellEditorParams: {
        rowDataValues: selectValues, for drop down?
        return_value: 'appointment_code', (return_value is used as key)
        column_info: [
            {header: "id" , init_width: 50},
            {header: "name", init_width: 50},
            {header: "username", init_width: 75 },
            {header: "email", init_width: 200 },
            {header: "phone", init_width: 150 },
            {header: "website", init_width: 100 }
        ]
        map_route: string
        map_params: {} 
        crud_value: 'id'
        return_field: ""
        view_aliases: {}
        lookup_aliases: {}
    }

    //make object by default. 

    cellEditor: "autoComplete",
The cellEditorFramework must be equal to 'AutocompleteAg' This tells the grid which input format to use.
selectValues: is the array that contains all the data and return values for the autocomplete column and related calculated fields. The data can be 
    initialized in each ./pages/xxx.vue if no map_route is defined i.e. !grid_row_rule.hasOwnProperty('map_route') this will be left unchanged. 
    Otherwise this will be overwritten by data from the server.
return_value: this is a name of a unique column in selectValues. This is whats returned by the autocomplete. Its also used as the key
    in the created maping function that allows calculated columns to generate values based on the return value inputed in a cell
api_route: this is the route either full i.e. localhost:3000/mapdata/appointments or relatvie /mapdata/appointments. This is the rest route
    to extract the selectValues array. 
    use post or get route?
crud_value:


axios return object
{ 'error_msg': err_msg, 'is_error': true, 'rows': [], 'table_name': table_name, 'route_name': route_name }

Returns:
autocomplete_map[field] -> {'selectValues': [{}], 'mapFunction': map_function, 'key': return_value, 'crud_value', crud_value }

gridWidth + 'px'
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
        :overlayLoadingTemplate="overlayLoadingTemplate"
        :overlayNoRowsTemplate="overlayNoRowsTemplate"
        stopEditingWhenGridLosesFocus: true
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
const debounce = require('debounce')

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
            is_async: false,
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
            ],

            overlayNoRowsTemplate: '<span class="ag-overlay-loading-center">No Rows</span>',
            overlayLoadingTemplate: '<span class="ag-overlay-loading-center">Please wait while your rows are loading</span>'
       }
    },

    components: { "ag-grid-vue":AgGridVue} ,



   methods: {
       /* Component Editor Lifecycle methods */
       // the final value to send to the grid, on completion of editing
        getValue() {
            // this simple editor doubles any value entered into the input
            let fx = this.handleClickOutside
            document.removeEventListener('click', fx)


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
            // console.log( x )
            // console.log( this.gridApi.getDisplayedRowAtIndex(0) )
            //if x is undefined?



            if (this.gridApi.getSelectedRows()[0]) {
                this.selectedObject = this.gridApi.getSelectedRows()[0];
                this.isCanceled = false;
                this.value = this.selectedObject['x']
                //console.log(this.value)
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
            console.log('ongridread')
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
            if (event.key == "ArrowLeft" || event.key == "ArrowRight") { return false; }
            event.stopPropagation();
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
            else { this.$refs.input.focus() }
        },

        change: debounce( async function(e) {
                this.gridApi.showLoadingOverlay();
                // await new Promise(r => setTimeout(r, 2000))
                this.gridApi.setQuickFilter(this.value)
                if (this.gridApi.getDisplayedRowAtIndex(0) !== undefined) {
                    this.gridApi.getDisplayedRowAtIndex(0).setSelected(true);
                    this.gridApi.ensureIndexVisible(0, "top");
                }
                this.gridApi.hideOverlay()
            }, 1000
        ),

        client_filter() {
                this.gridApi.showLoadingOverlay();
                this.gridApi.setQuickFilter(this.value)
                if (this.gridApi.getDisplayedRowAtIndex(0) !== undefined) {
                    this.gridApi.getDisplayedRowAtIndex(0).setSelected(true);
                    this.gridApi.ensureIndexVisible(0, "top");
                }
                this.gridApi.hideOverlay()
        },



        async server_filter() {
            this.gridApi.showLoadingOverlay()
            //try catch

            //await filter
            //clear row_data
            //add_new_data
            this.gridApi.hideOverlay()

        },
        set_params() {},
        handleClickOutside(event) {
            // if (!this.$el.contains(event.target)) {
            //     this.params.api.stopEditing();

            // }
            if (!this.$refs.autoCompleteArea.contains(event.target)) {
                this.params.api.stopEditing(); 

            }

        },

    // mounted() { document.addEventListener('click', this.handleClickOutside)},
    // destroyed() { document.removeEventListener('click', this.handleClickOutside)},


   },
    mounted() {
        console.log('mounted')
        document.addEventListener('click', this.handleClickOutside)

        this.input = this.$refs.input;
        this.value = this.params.value;
        if (this.params.key == "Backspace") {this.value = "" } 
        else if (this.params.key == "Delete") { this.value = ""}
        else if (this.params.charPress !== null ) { this.value = this.params.charPress }
        console.log(this.params.return_value)
        console.log(this.params.column_info)
        this.$nextTick(() =>  { this.$refs.input.focus() } );
    }
}



</script>
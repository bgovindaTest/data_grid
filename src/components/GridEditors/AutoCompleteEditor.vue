<!--
This module is responsible for initializing the data parameters and functions required for the autocomplet widget.
Each grid_column_rule has the structure below. A more indepth description is in ./library/grid_rules.js
  {
    field: 'field_name,
    data_type: 
    cellEditorFramework: "autoComplete"
    cellEditorParams: {
        rowData: from valuesObject
        columnDefs: array or json object
    }

Not implemented for live searching yet. api_route is fired during initialization.
-->
<template>
  <div ref="autoCompleteArea" :style="{ width: gridWidth + 'px' }" >
    <input
      ref="input"
      v-model="search_str"
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
const type_check = require('../../lib/TypeCheck')

export default {
 
   data() {
       return {
            gridApi: null,
            search_str: "",
            value: null,
            backupValue: null,
            queryChars: 2,
            gridHeight: 400,
            gridWidth: 650,
            rowSelection: "single",
            propertyName: null,
            displayKey: null,
            is_async: false,
            columnDefs: null,
            rowData: null,
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
            // let fx = this.handleClickOutside
            // document.removeEventListener('click', fx)
            this.params.eGridCell.focus()
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
            let x = this.value
            if (type_check.IsNull(x) )     {return false}
            if (type_check.IsObject(x) )   {return false}
            if (type_check.IsUndefined(x)) {return false}
            return true
        },

        rowConfirmed() {
            let x = this.gridApi.getSelectedRows()[0]

            if (this.gridApi.getRenderedNodes().length === 0) {
                this.value = null
            } else if (x) {
                this.selectedObject = x
                this.isCanceled = false;
                this.value = this.selectedObject
            }
            //get firs row_data field?
            this.params.api.stopEditing();
            // this.$refs.autoCompleteArea.removeEventListener("keydown", () => null);
        },


        rowClicked(event) {
            this.selectedObject = event.data;
            this.value = this.selectedObject
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
            if (this.search_str !== "" ) {
                this.gridApi.setQuickFilter(this.search_str)
            }
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
                this.gridApi.setQuickFilter(this.search_str)
                if (this.gridApi.getDisplayedRowAtIndex(0) !== undefined) {
                    this.gridApi.getDisplayedRowAtIndex(0).setSelected(true);
                    this.gridApi.ensureIndexVisible(0, "top");
                }
                this.gridApi.hideOverlay()
            }, 50
        ),

        client_filter() {
                this.gridApi.showLoadingOverlay();
                this.gridApi.setQuickFilter(this.search_str)
                if (this.gridApi.getDisplayedRowAtIndex(0) !== undefined) {
                    this.gridApi.getDisplayedRowAtIndex(0).setSelected(true);
                    this.gridApi.ensureIndexVisible(0, "top");
                }
                this.gridApi.hideOverlay()
        },
        async server_filter() {
            //need to implement
            this.gridApi.showLoadingOverlay()
            this.gridApi.hideOverlay()

        },
        set_params() {},
        handleClickOutside(event) {
            if (!this.$refs.autoCompleteArea.contains(event.target)) {
                //reset values?
                this.value = this.backupValue
                this.params.api.stopEditing();
            }

        },

   },
    mounted() {
        document.addEventListener('click', this.handleClickOutside)
        this.input = this.$refs.input;
        this.search_str =  "" //this.params.value;
        if (this.params.key == "Backspace") {this.search_str = "" } 
        else if (this.params.key == "Delete") { this.search_str = ""}
        else if (this.params.charPress !== null ) { 
            this.search_str = this.params.charPress 
        }

        // console.log(this.params.value)
        // console.log(typeof this.params.value)

        if (typeof this.params.value === "string") {
            this.search_str = this.params.value
        }
        let colDef = this.params.colDef
        let cep = colDef['cellEditorParams']
        this.columnDefs = cep['columnDefs']
        this.rowData    = cep['rowData']
        this.displayKey = cep['displayKey']
        this.propertyName = cep['displayKey']
        if (cep.hasOwnProperty('gridHeight') ) {this.gridHeight = cep['gridHeight']}
        if (cep.hasOwnProperty('gridWidth') ) {this.gridWidth   = cep['gridWidth']}
        if (type_check.IsObject(this.params.value) ) {
            this.backupValue = this.params.value
        }
        this.$nextTick(() =>  { this.$refs.input.focus() } );
    },
    beforeUnmount() {
        let fx = this.handleClickOutside
        document.removeEventListener('click', fx)
    }
}



</script>
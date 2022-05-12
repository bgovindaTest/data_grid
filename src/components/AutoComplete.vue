<!--



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

</script>


<style lang="scss">
  @import "~ag-grid-community/dist/styles/ag-grid.css";
  @import "~ag-grid-community/dist/styles/ag-theme-alpine.css";
</style>
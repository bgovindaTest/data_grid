<!--
emit undo event on click?
//adds delete and undo column

cell renderor

may require emitter for 
-->


<template>
<div >
    <button > 
        <font-awesome-icon :icon="['fas', 'undo']" />
    </button>
    <button @click="is_deleted = !is_deleted" > 
        <font-awesome-icon :icon="['fas', 'trash-alt']" v-if="is_deleted" />   
        <font-awesome-icon :icon="['far', 'trash-alt']" v-else /> 
    </button>
</div>
</template>

<script>

export default {
 
   data() {
       return {
            is_deleted: false,
            can_delete: true,
            can_undo: true,
            value: true,
            cellValue: null
       }
    },


   methods: {
       /* Component Editor Lifecycle methods */
       // the final value to send to the grid, on completion of editing
        beforeMount() {
            // this simple editor doubles any value entered into the input
            this.cellValue = this.params
        }
   }

}

// function removeSelected() {
//   const selectedRowNodes = gridOptions.api.getSelectedNodes();
//   const selectedIds = selectedRowNodes.map(function (rowNode) {
//     return rowNode.id;
//   });
//   immutableStore = immutableStore.filter(function (dataItem) {
//     return selectedIds.indexOf(dataItem.symbol) < 0;
//   });
//   gridOptions.api.setRowData(immutableStore);
// }


</script>
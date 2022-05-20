<!--
emit undo event on click?
//adds delete and undo column

cell renderor
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

</script>
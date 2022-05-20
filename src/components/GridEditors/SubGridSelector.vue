<!--
emit undo event on click?
//adds delete and undo column

cell renderor
-->


<template>
    <button @click="LaunchModal()" > {{grid_name}} </button> <!--@click launch submodal -->
</template>

<script>

export default {
 
   data() {
       return {
            grid_name: null,
            can_delete: true,
            can_undo: true,
            value: true,
            cellValue: null,
            row_data: null
       }
    },
    beforeMount() {
        // this simple editor doubles any value entered into the input
        this.cellValue = this.params
        console.log(this.params)
        this.grid_name = 'cfte'
        this.row_data = this.params.data
        console.log(this.row_data)
    },


   methods: {
       LaunchModal() {
           this.row_data.meta.modal1 = true;
           console.log(this.row_data)
       }
       /* Component Editor Lifecycle methods */
       // the final value to send to the grid, on completion of editing
        // beforeMount() {
        //     // this simple editor doubles any value entered into the input
        //     this.cellValue = this.params
        //     this.grid_name = 'cfte'
        // }
   }

}

</script>
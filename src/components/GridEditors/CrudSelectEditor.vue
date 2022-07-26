<!--
emit undo event on click?
//adds delete and undo column

cell renderor

may require emitter for 
-->


<template>
<div >

    <button title="Add/Copy Row" @click="Add()"> 
        <font-awesome-icon :icon="['fas', 'plus']" />
    </button>


    <button title="Undo Row" @click="Undo()"> 
        <font-awesome-icon :icon="['fas', 'undo']" />
    </button>
    <button @click="Delete()" title="Set For Delete" > 
        <font-awesome-icon :icon="['fas', 'trash-alt']" v-if="is_deleted" />   
        <font-awesome-icon :icon="['far', 'trash-alt']" v-else /> 
    </button>

    <button title="Remove Row" @click="Remove()" > 
        <font-awesome-icon :icon="['fas', 'ban']" />
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
            cellValue: null,
            metaFunctions: null,
       }
    },
    mounted () {
            console.log(this.params)
            console.log(this.params.data)
    },

    methods: {
       /* Component Editor Lifecycle methods */
       // the final value to send to the grid, on completion of editing
        Delete() {

        },
        Remove() {

        },
        Add() {

        },
        Undo() {

        }
    }

}

</script>
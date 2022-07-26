<!--
emit undo event on click?
//adds delete and undo column

cell renderor

may require emitter for 

        cep['gridFunctions'] = MetaFunctions


        // gf['Insert']       = this.InsertRowInit(defaultValues) //for newly added rows via add row or new_sheet
        // gf['CopyRow']      = this.CopyRowInit()
        // gf['Update']       = this.UpdateRowInit() //for rows created from querying the database
        // gf['Undo']         = this.UndoRow() //function to reset row based on backup values
        // gf['Delete']       = this.DeleteRow()
        // gf['SetDelete']       = this.DeleteRow()
        // gf['UndoDelete']   = this.DeleteUndoRow()
        // gf['SetDelete']    = this.SetDelete()

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
    /*




    */


    data() {
        return {
            is_deleted: false,
            can_delete: true,
            can_undo: true,
            value: true,
            cellValue: null,
            gridFunctions: null,
            rowDataParams: {},
            crudType: null,
            api: null,

        }
    },
    mounted () {
        let colDef = this.params.colDef
        let cep    = colDef['cellEditorParams']
        let gf     = cep['gridFunctions']
        this.gridFunctions = gf
        // console.log(gf)
        this.api = this.params.api
        this.rowDataParams['data'] = this.params.data
        let rowData = this.params.data
        let rdp = this.rowDataParams

        this.is_deleted = gf['DeleteStatus'](rdp)
        console.log(this.params)
        // this.gridFunctions = 
            // console.log(this.params.data)
    },

    methods: {
        /* Component Editor Lifecycle methods */
        // the final value to send to the grid, on completion of editing
        Delete() {
            let rdp = this.rowDataParams
            let fn  = this.gridFunctions['SetDelete'] 
            fn(rdp)
            let fns  = this.gridFunctions['DeleteStatus'] 
            this.is_deleted = fns(rdp)
            this.api.refreshCells()
        },
        Remove() {
            let rowData = this.params.data
            this.api.applyTransaction({'remove': [rowData] })
        },
        Add() {
            let row_index = this.params.node.rowIndex
            let rdp = this.rowDataParams
            let fn  = this.gridFunctions['CopyRow']
            let newRowData = fn(rdp)
            this.api.applyTransaction({'add':[newRowData], 'addIndex': row_index})
        },
        Undo() {
            let rdp = this.rowDataParams
            let fn  = this.gridFunctions['Undo'] 
            fn(rdp)
            this.api.refreshCells()
        }
    }

}

</script>
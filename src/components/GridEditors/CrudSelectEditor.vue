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

    <button title="Add/Copy Row" @click="Add()" v-if="allow_add"> 
        <font-awesome-icon :icon="['fas', 'plus']" />
    </button>


    <button title="Undo Row" @click="Undo()" v-if="allow_undo"> 
        <font-awesome-icon :icon="['fas', 'undo']" />
    </button>
    <button @click="Delete()" title="Set For Delete" v-if="allow_delete" > 
        <font-awesome-icon :icon="['fas', 'trash-alt']" v-if="is_deleted" />   
        <font-awesome-icon :icon="['far', 'trash-alt']" v-else /> 
    </button>

    <button title="Remove Row" @click="Remove()" v-if="allow_remove"> 
        <font-awesome-icon :icon="['fas', 'ban']" />
    </button>


</div>
</template>

<script>

const data_config = require('../../lib/DataConfig')
const meta_column = data_config.meta_column_name

export default {
    /*




    */


    data() {
        return {
            is_deleted: false,
            allow_delete: false,
            allow_undo: false,
            allow_add: false,
            allow_remove: null,
            gridFunctions: null,
            rowDataParams: {},
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
        let rdp = this.rowDataParams

        //add parameters
        this.is_deleted = gf['DeleteStatus'](rdp)
        let mc = this.rowDataParams.data[meta_column]
        let crudType = mc['crudType']

        this.allow_delete = cep['allowDelete'][crudType]
        this.allow_undo   = cep['allowUndo'][crudType]
        this.allow_add    = cep['allowCopy'][crudType]
        this.allow_remove = cep['allowRemove'][crudType]


        // console.log(this.params)
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
            let rdp = {}
            rdp['data'] = this.rowDataParams.data
            rdp['meta_column'] = {} //ignore meta_column in data use defaults
            let fn  = this.gridFunctions['CopyRow']
            let newRowData = fn(rdp)
            this.api.applyTransaction({'add':[newRowData], 'addIndex': row_index})
        },
        Undo() {
            let rdp = this.rowDataParams
            console.log(rdp.data[meta_column])
            let fn  = this.gridFunctions['Undo'] 
            fn(rdp)
            this.api.refreshCells()
        }
    }

}

</script>
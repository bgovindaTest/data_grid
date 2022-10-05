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
        // this.rowDataParams['data'] = this.params.data
        // let rdp = this.rowDataParams

        //add parameters
        this.is_deleted = this.params.data[meta_column]['is_delete']
        let mc          = this.params.data[meta_column]
        let crudType = mc['crudType']
        //for row level is insert or is update

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
            /*
            DeleteStatus and SetDelete not working clearing information?
            */
            let x = this.is_deleted
            this.is_deleted = !x
            this.params.data[meta_column]['is_delete'] = !x
            this.api.refreshCells()
        },
        Remove() {
            let rowData = this.params.data
            this.api.applyTransaction({'remove': [rowData] })
        },
        Add() {
            let row_index = this.params.node.rowIndex
            let rdp = {}
            rdp['data'] =   this.params.data//this.rowDataParams.data
            rdp['meta_column'] = {} //ignore meta_column in data use defaults
            let fn  = this.gridFunctions['CopyRow']

            let newRowData = fn(rdp)
            this.api.applyTransaction({'add':[newRowData], 'addIndex': row_index})
        },
        Undo() {
            let fn  = this.gridFunctions['Undo']
            let x = this.params.data
            //fn(rdp)
            fn({'data': x})
            let dx = this.params.data[meta_column]['is_delete']
            this.is_deleted = dx
            this.api.refreshCells()
        }
    }

}

</script>
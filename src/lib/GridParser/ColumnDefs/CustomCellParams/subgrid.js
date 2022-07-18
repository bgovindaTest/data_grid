/*
Responsible for creating each columns rules for displaying and formatting the data.
3.) subGrid is last cellEditor to be initialized

Valid cell editors and processing?

This module is responsible for initializing the data parameters and functions required for the autocomplet widget.
Each grid_column_rule has the structure below. A more indepth description is in ./library/grid_rules.js

    field: 'field_name,
    //not sortable

    cellEditor: "subGrid"
    cellEditorParams: {
        subGridPos: 0
        onSaveMainRefresh: true/false
        row_name: { 'field': , 'paramsKey': } is optional passes info of row as subgrid name
        pre_name: ''  for concatenations before name
        post_name: '' for concatenations after name
        subGridName: 'string' if empty assemble from pre_name + row_name + post_name


        rowDataDefaults = {
            //generated from rowData
            'defaultFilter': {}
            'defaultValue':  {}
        }
        defaultValues: {subGridKey: {rowKey: , paramsKeys:    } } 
            if paramsKey exists assumbes rowData field is object or array.
            other wise just return value direclty from array. Should clone if 
            object so child cant change value.

        defaultFilter: {subGridKey: {rowKey: , operator: ,rowKey2:   } } 
            if paramsKey exists assumbes rowData field is object or array.
            other wise just return value direclty from array. Should clone if 
            object so child cant change value. Enforced filters are determined
            based on subGrid showFilter option


*/
const auxFuncs = require('./auxilary_funcs')
const CellEditorParamsCheck = auxFuncs['CellEditorParamsCheck']


class SubGridParams {
    constructor(grid_column) {
        this.grid_column  = grid_column
    }

    SubGridParamsInit() {
        let grid_column = this.grid_column
        CellEditorParamsCheck(grid_column)
        let ce = grid_column['cellEditorParams']
        if (! ce.hasOwnProperty('subGridPos')) {
            let field = grid_column['field']
            console.error(`missing subGridPos for ${field} setting to 1`)
            ce['subGridPos'] = 1
        }
        this.SetDefaults()
    }


    SubGridDefaults(rowData) {
        /*
        Converts everyting to uniform object inorder to set static fields.

        //returns a function

        Adds vales from row to create submodal grid.
        rowDataDefaults = {

        }
        */
        let cep = this.grid_column['cellEditorParams']
        let rdf = cep['rowDataDefaults']
        let df  = rdf['defaultFilter' ] || {}
        let dv  = rdf['defaultValue']   || {}
        let defaultSort  = rdf['defaultSort']    || []
        let defaultFilter    = this.DefaultObject(df, rowData)
        let defaultValue     = this.DefaultObject(dv, rowData)

        return {'defaultSort': defaultSort, 'defaultFilter': defaultFilter,
                'defaultValue':  defaultValue}

    }


    SetDefaults() {
        //remove parameters not needed. passes cellRenderer function direclty
        this.grid_column['isRequired']  = false
        this.grid_column['ignoreError'] = true 
        this.grid_column['dataType'] = 'text'
        this.grid_column['editable'] = false 
        this.grid_column['hide'] = false
        let chmodParams = {}
        chmodParams['isPull']   = false  
        chmodParams['isPush']   = false
        chmodParams['isChange'] = false
        this.grid_column['chmodParams'] = chmodParams

        let cep = this.grid_column['cellEditorParams']
        let field = this.grid_column['field']
        if (! cep.hasOwnProperty('pre_name')) { cep['pre_name'] ="" }
        if (! cep.hasOwnProperty('post_name')) { cep['post_name'] ="" }
        if (! cep.hasOwnProperty('row_name') ) {
            if (! cep.hasOwnProperty('subGridName')) {
                cep['subGridName'] = String(field)
            }
        }
    }
}



module.exports = SubGridParams
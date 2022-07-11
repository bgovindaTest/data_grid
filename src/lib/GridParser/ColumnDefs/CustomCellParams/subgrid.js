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
        row_name: { 'field': , 'paramsKey': }
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
            object so child cant change value.


*/
const type_check = require('../../../TypeCheck')

class SubGrid {
    constructor(grid_column) {
        this.grid_column  = grid_column
    }

    SubGridParams(grid_column) {
        let is_subgrid = grid_column['cellEditor'] || ""
        if (is_subgrid != "subGrid") { return }
        let subgridPos = grid_column["cellEditorPrams"]['gridPos'] || 0
        grid_column["cellEditorParams"]['field'] = grid_column['field']
        //make integer.
        if (subgridPos === 0 || subgridPos > this.grid.length ) {
            console.error('Subgrid out of bounds should not be main grid')
        }
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
        let ef  = rdf['enforcedFilter'] || {}
        let dv  = rdf['defaultValue']   || {}
        let defaultSort  = rdf['defaultSort']    || []
        let defaultFilter    = this.DefaultObject(df, rowData)
        let enforcedFilter   = this.DefaultObject(ef, rowData)
        let defaultValue     = this.DefaultObject(dv, rowData)

        return {'defaultSort': defaultSort, 'defaultFilter': defaultFilter,
            'enforcedFilter': enforcedFilter, 'defaultValue':  defaultValue}

    }
    // MergeDefaults(grid_defualts, sub_grid_defaults) {}
    DefaultObject(dx,rowData) {
        let def_obx = {} //field_name: value
        let keys = Object.keys(dx)
        for (let i =0; i <keys.length; i++ ) {
            let cn = keys[i]
            let val = dx[cn]
            if (type_check.IsObject(val) ) {
                if (val.hasOwnProperty('lookupKey')) {
                    let lookupKey = val['lookupKey']
                    let field = val['field']
                    def_obx[cn] =  rowData[ field ][lookupKey]

                } else {
                    let field = val['field']
                    def_obx[cn] =  rowData[field]
                }
            }
            else { def_obx[cn] = val }
        }

    }
}



module.exports = {'SubGrid': SubGrid}
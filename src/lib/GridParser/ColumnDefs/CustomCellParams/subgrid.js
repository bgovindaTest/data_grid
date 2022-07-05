/*
Responsible for creating each columns rules for displaying and formatting the data.

Valid cell editors and processing?

This module is responsible for initializing the data parameters and functions required for the autocomplet widget.
Each grid_column_rule has the structure below. A more indepth description is in ./library/grid_rules.js
  {
    field: 'field_name,
    data_type: for sorting purposes? (maybe requires sortField)
    cellEditor: "subGrid"
    cellEditorParams: {
        subGridPos: 0
    }


3.) subGrid
subGridPos
rowDataDefaults = {
    'defaultFilter': [] key value? fro row params
    'defaultSort': []
    'enforcedFilters': []
    'defaultValue':  []
}
rowDataDefaults pulls data from calling row to assemble subgrid

*/
const type_check = require('../../../TypeCheck')


// columnDefs: [
//     {
//         cellEditor: 'agLargeTextCellEditor', 'agTextCellEditor'
//         cellEditorPopup: true,
//         cellEditorParams: {
//             maxLength: 100,
//             rows: 10,
//             cols: 50
//         }
//         // ...other props
//     }
// ]


class CustomEditor {
    //for main loader
    //grid is json object for aggrid
    //allowNull (prepends value?)

    //valuesArray created by grid_func mix in?
    constructor(grid_column, valuesObject) {
        this.grid_column  = grid_column
        this.valuesObject = valuesObject
    }

    SubGridParams(grid_column) {
        let is_subgrid = grid_column['cellEditor'] || ""
        if (is_subgrid != "subGrid") { return }
        let subgridPos = grid_column["cellEditorPrams"]['gridPos'] || 0
        //make integer.
        if (subgridPos === 0 ) {
            console.log('Subgrid out of bounds')
            return 
        }
        //valuesArray
        //mapObject
    }
    SubGridRowDataDefaults(grid_column, rowDataDefaultRules, rowData) {
        /*
        Converts everyting to uniform object inorder to set static fields.


        Adds vales from row to create submodal grid.
        rowDataDefaults = {
            'defaultFilter': [] key value? fro row params
            'defaultSort': []
            'enforcedFilters': []
            'defaultValue':  []
        }

        */
        return

    }



}







// function SubGridRowDataDefaults(grid_column, rowDataDefaultRules, rowData) {
//     /*
//     Adds vales from row to create submodal grid.
//     rowDataDefaults = {
//         'defaultFilter': [] key value? fro row params
//         'defaultSort': []
//         'enforcedFilters': []
//         'defaultValue':  []
//     }

//     */
//     return

// }

module.exports = {'CustomEditor': CustomEditor, 'ReturnGridValuesObject': ReturnGridValuesObject}
/*
Used to process lookups


*/
const type_check = require('../../TypeCheck')


//add functionality for aliases later
//error if is string. means no match found
function LookupParse(column_name, queryRowData) {
    let column_value = {}
    let keys = Object.keys(queryRowData)
    let cn_dot = column_name+'.'
    for(let i =0; i < keys.length; i++ ) {
        let value = queryRowData[keys[i]]
        let key = keys[i]
        if (key.startsWith(cn_dot) ) {
            let k2 = key.split('.')
            if (k2.length < 2) {continue}
            column_value[k2[1].trim() ] = value
        }
    }
    return column_value
}


function IsLookup(column_name, lookupColumns) {
    if (lookupColumns.hasOwnProperty(column_name)) {return true}
    return false
}


function CreateLookupObject(grid) {
    //column_name
    let lookups = {}
    for(let i=0; i < grid.length; i++) {
        let grid_column = grid[i]


    }
}

let lookupCellEditors = ["autoComplete", "agSelectCellEditor"]
function ColumnHasLookup(grid_column) {
    //column_name
    //bbc
    let ce         = grid_column["cellEditor"]
    if (! lookupCellEditors.includes(ce)) { return {} }
    let is_lookup  = grid_column["cellEditorPrams"]['isLookup'] || false
    if (! is_lookup) { return {} }
    let push_key = grid_column["cellEditorPrams"]['pushKey'] //defaults to field
    let pull_key = grid_column["cellEditorPrams"]['pullKey'] //defaults to id
    let display_key = grid_column["cellEditorPrams"]['pullKey']
    //lookupId
    //queryId

    for(let i=0; i < grid.length; i++) {
        let grid_column = grid[i]


    }
}
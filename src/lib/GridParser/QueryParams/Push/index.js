/*
Main functions for processing crud events and sending data back and forth
between UI and server.

Creates rowData from server row


Process and store OrderBy and FilterParams

ui_fileds

need array of set fields for upsert?

let query_params = [
    Array of objects. Contains information for crud operations.
    Operation order is not preserved.
    {
        "crud_type": "", //only needed for save route 
        "data": "", //array of objects: [{x:"valx1", y:"valy1"},{x:"valx2", y:"valy2"}]
        "default_fields": "", //object with default type {x:"default_value_x", y:"default_value_y"}
        "set_fields": "",  //array that has columns that should be used for set on upsert
        "on_conflict": "", //string a-zA-Z0-9
        "on_constraint": "", //string a-zA-Z0-9
        "where": "", //array of objects: [{x:"valx1", y:"valy1"},{x:"valx2", y:"valy2"}]
        "offset": "", //should be integer greater or equal to 0
        "limit": "", //should be positive integer
        "search_filter": "", //string or object with quick filter type:
        "search_rank": "", //bool
        "returning": "", //array of fields to used for returning [id, column_1, xxx] //defaults to id?
        "order_by": ""  // [{'col1': 'asc}, {'col_2': 'desc'}] 
        }
    ]

*/


const data_types = require ('../../DataConfig')
const type_check = require('../../TypeCheck')



//crud_fields
//ignore primary_key

function ModifyParams(grid) {


}

//columnEditors

function Insert(out_data, rowData, insertParams) {


    let crud_fields = insertParams['crudFields']
    let ce          = insertParams['columnEditors']
    let mo          = insertParams['mapObject']
    let ap          = insertParams['autoCompleteParams']
    let x = {}
    for(let i =0; i < crud_fields.length; i++) {
        let cf = crud_fields[i]
        if (ce[cf] === 'autoComplete') {
            let ap2 = ap[cf]
            AutocompleteParse(rowData, x, cf, ap2['pullKey'], ap2['pushKey'])
        } else if ( ce[cf] === 'agRichSelectEditor') {
            agRichSelectCellEditorParse(rowData, outRow, mapObject, field)
        } else { x[cf] = rowData[cf] || null }
    }
    out_data.push(x)
}


function Delete(out_data, rowData, deleteParams) {
    //id only?
    x = {'id': rowData['id']}
    out_data.push(x)

}
function Update(out_data, rowData, updateParams) {
    //post process
    let crud_fields = updateParams['crudFields']
    let lookups     = updateParams['lookups']
    let x = {}
    for(let i =0; i < crud_fields.length; i++) {
        let cf = crud_fields[i]
        let is_lookup = lookups[cf] || false
        if (is_lookup) {

        } else { x[cf] = rowData[cf] || null }

    }
    out_data.push(x)

}

function AssemblyInserts( crudParamsObject) {

    //upsert or onconflict
    //set or data?
    //pk
    //takes all insert, update and delete statements
    //and creates final object for batch statements.
}

function AssemblyUpdates( crudParamsObject) {

    //upsert or onconflict
    //set or data?
    //pk
    //takes all insert, update and delete statements
    //and creates final object for batch statements.
}

function AssemblyDeletes( crudParamsObject) {

    //upsert or onconflict
    //set or data?
    //pk
    //takes all insert, update and delete statements
    //and creates final object for batch statements.
}


function ProcessModifyErrorStatements() {}


function AutocompleteParse(rowData, outRow, field, pullKey, pushKey) {
    let lookup = rowData[field] || null
    if (lookup === null) {
        outRow[pushKey] = null
        return
    }
    let value = lookup[pullKey] || null
    outRow[pushKey] = value
    return
}


function agRichSelectCellEditorParse(rowData, outRow, mapObject, field) {
    let displayValue = rowData[field]
    //no mapObject. just return flat value.

    let value = mapObject[displayValue] || null
    outRow[field] = value
}
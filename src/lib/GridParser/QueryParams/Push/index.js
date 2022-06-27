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

function Insert(out_data, rowData, insertParams) {
    /*
    Appends row to out_data for inserts
    */
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
            let mapObject = mo[cf]
            agRichSelectCellEditorParse(rowData, outRow, mapObject, field)
        } else { x[cf] = rowData[cf] || null }
    }
    out_data.push(x)
}


function Delete(out_data, rowData, deleteParams) {
    //id only?
    //add primary key options later
    x = {'id': rowData['id']}
    out_data.push(x)

}
function Update(out_data, rowData, updateParams) {
    //post process
    let crud_fields = insertParams['crudFields']
    let ce          = insertParams['columnEditors']
    let mo          = insertParams['mapObject']
    let ap          = insertParams['autoCompleteParams']
    let x = {'id': rowData['id']}
    for(let i =0; i < crud_fields.length; i++) {
        let cf = crud_fields[i]
        if (ce[cf] === 'autoComplete') {
            let ap2 = ap[cf]
            AutocompleteParse(rowData, x, cf, ap2['pullKey'], ap2['pushKey'])
        } else if ( ce[cf] === 'agRichSelectEditor') {
            let mapObject = mo[cf]
            agRichSelectCellEditorParse(rowData, outRow, mapObject, field)
        } else { x[cf] = rowData[cf] || null }

    }
    out_data.push(x)

}

/*
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

    { 
        default: ->
        select:  ->
        insert:  -> //string or {'route': 'string', 'instead': 'update', 'crudParams': {}}
        update:  ->
        delete:  ->
        upsert_set: [] //for upsert only
        set: [] //for update will just filter things out from data object
        default_fields: {}
        on_contraint:
        on_conflict:
    }
*/




function AssemblyInserts( out_data, crudParamsObject) {

    let insert_out_params = {
        'data': out_data,
        "default_fields": crudParamsObject['default_fields'] || "",
        "on_conflict":    crudParamsObject['on_conflict'] || "",
        "on_constraint":  crudParamsObject['on_constraint'] || "",
        "set_fields":     crudParamsObject['set_fields'] || "",
    }
    //may need to append default values
    return insert_out_params
}

function AssemblyUpdates( out_data, crudParamsObject) {

    let update_out_params = {
        'data': out_data,
        "default_fields": crudParamsObject['default_fields'] || "",
        "set_fields":     crudParamsObject['set_fields'] || "",
    }
    return update_out_params

}

function AssemblyDeletes( crudParamsObject) {
    let update_out_params = {
        'data': out_data,
        "default_fields": crudParamsObject['default_fields'] || "",
        "set_fields":     crudParamsObject['set_fields'] || "",
    }
    return update_out_params


}


function ProcessModifyErrorStatements() {}


function AutocompleteParse(rowData, outRow, field, pullKey, pushKey) {
    //gets id/primary key value for lookup column
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
    //mapObject either object or null
    let displayValue = rowData[field]
    //no mapObject. just return flat value.
    //mapObject should be false
    if (mapObject === null) { 
        outRow[field] = displayValue
        return
    }
    let value = mapObject[displayValue] || null
    outRow[field] = value
}

function ExtractParams(crudParams) {



}

module.exports = {

}
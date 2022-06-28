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
let meta_column    = data_types['meta_column_name']
let meta_crud_type = data_types['meta_crud_type']
let meta_is_delete = data_types['meta_delete_undo_name']

// 'meta_crud_type': meta_crud_type,
// 'meta_column_name': meta_column_name,
// 'meta_delete_undo_name': meta_delete_undo_name,


//crud_fields
//ignore primary_key
function SetCrudData(out_data, rowData, crudParams) {
    let mc = rowData[meta_column]
    let crud_type  = mc[meta_crud_type] || "" //from row determines if data pulled form server or added like a new row
    let is_delete = mc[meta_is_delete]
    let crudType  = crudParams[crud_type]['crudType'] //allows for change in post processing i.e. update to insert.

    if (is_delete === 'delete') {
        Delete(out_data, rowData, crudParams['delete'])
    } else if (crudType === 'insert') { 
        Insert(out_data, rowData, crudParams['insert'])
    } else if (crudType === 'update') {
        Update(out_data, rowData, crudParams['update'])
    } else {
        console.log(`invalid crud type ${crudType}`)
    }
}


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
    //filters
    //post process
    let crud_fields = updateParams['crudFields']
    let ce          = updateParams['columnEditors']
    let mo          = updateParams['mapObject']
    let ap          = updateParams['autoCompleteParams']
    let set_filter  = updateParams['setFilter']
    let use_set_filter     = updateParams['useSetFilter'] || false //based on if empty or not
    let x = {'id': rowData['id']}
    let count = 0
    for(let i =0; i < crud_fields.length; i++) {
        let cf = crud_fields[i]
        if (use_set_filter) {
            if (! set_filter.includes(cf)) {continue}
        }
        count += 1

        if (ce[cf] === 'autoComplete') {
            let ap2 = ap[cf]
            AutocompleteParse(rowData, x, cf, ap2['pullKey'], ap2['pushKey'])
        } else if ( ce[cf] === 'agRichSelectEditor') {
            let mapObject = mo[cf]
            agRichSelectCellEditorParse(rowData, outRow, mapObject, field)
        } else { x[cf] = rowData[cf] || null }

    }
    if (count == 0) {
        console.log('all data filtered out')
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
        on_constraint:
        on_conflict:
    }
*/



//creates payload for req body
function SetReqBody(out_data, crudType, crudParams) {
    if (crudType === 'delete') {
        ReqBodyDeletes(out_data, rowData, crudParams['delete'])
    } else if (crudType === 'insert') { 
        ReqBodyInserts(out_data, rowData, crudParams['insert'])
    } else if (crudType === 'update') {
        ReqBodyUpdates(out_data, rowData, crudParams['update'])
    } else {
        console.log(`invalid crud type ${crudType}`)
    }

}

function ReqBodyInserts( out_data, insertParamsObject) {

    let insert_out_params = {
        'data': out_data,
        "default_fields": insertParamsObject['default_fields'] || "",
        "on_conflict":    insertParamsObject['on_conflict'] || "",
        "on_constraint":  insertParamsObject['on_constraint'] || "",
        "set_fields":     insertaramsObject['set_fields'] || "",
    }
    //may need to append default values
    return insert_out_params
}

function ReqBodyUpdates( out_data, updateParamsObject) {

    let update_out_params = {
        'data': out_data,
        "default_fields": updateParamsObject['default_fields'] || "",
        "set_fields":     updateParamsObject['set_fields'] || "",
    }
    return update_out_params

}

function ReqBodyDeletes( out_data, deleteParamsObject) {
    let delete_out_params = {
        'data': out_data,
        "default_fields": deleteParamsObject['default_fields'] || "",
        "set_fields":     deleteParamsObject['set_fields'] || "",
    }
    return delete_out_params
}

function ReqErrorStatements() {
    //count and log errors
}


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

module.exports = {
    'SetCrudData': SetCrudData,
    'SetReqBody':  SetReqBody
}

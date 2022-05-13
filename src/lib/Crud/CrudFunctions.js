/*
This module contains the code that is responsible for sending and receiving data to the server via
crud operations. This module provides the functions to pull data and saving data to the server.


Query Type: Get Routes:
For pulling data from the server. The structure below is used. The rows is what should be processed and set to the
client grid 
get_route
    'error_msg': err_msg, 'is_error': true, 'rows': [], 'table_name': table_name, 'route_name': route_name }


Saving Data:
For saving data the server expect a req.body object containing the following structure. If the route is empty just send an empty array 
otherwise each object in the array should contain the key:value pairs required
to save data to the server.

req.body['insert'] = [{}]
req.body['update'] = [{}]
req.body['upsert'] = [{}]
req.body['delete'] = [{}]

Saving Data Returned From Server: Below is the structure of the return values. Its primarily meant to communciate what 
data failed to be saved and why. if is_eror is true the error_msg should be attached to the corresponding row based
on node_id. If there are error the grid will be set to display an error state where error messages are shown as the 
last column. All other grid functions will be disabled.

save_route format json object
{
    "error": {
        "is_error": false,
        "error_msg": ""
    },
    "output": {
        "insert": [
            {
                "is_error": true,
                "node_id": 23,
                "error_msg": "insert not allowed for users table. in route users for client row 23",
                "id": -1
            }
        ],
        "update": [
            {
                "is_error": true,
                "node_id": 4,
                "error_msg": "Cannot change value of role for primary admin 4",
                "id": 1
            },
            {
                "is_error": false,
                "node_id": 21,
                "error_msg": "",
                "id": 4
            },
            {
                "is_error": true,
                "node_id": -1,
                "error_msg": "Nothing to update after permissions filter.",
                "id": -1
            }
        ],
        "upsert": [
            {
                "is_error": true,
                "node_id": 4,
                "error_msg": "upsert not allowed for users table. in route users for client row 4",
                "id": -1
            }
        ],
        "delete": [
            {
                "is_error": true,
                "node_id": 4,
                "error_msg": "delete not allowed for users table. in route users for client row 4. Row can be deactivated  by setting is_active to false to prevent further use and to hide.",
                "id": 70
            },
            {
                "is_error": true,
                "node_id": 4,
                "error_msg": "delete not allowed for users table. in route users for client row 4. Row can be deactivated  by setting is_active to false to prevent further use and to hide.",
                "id": 1
            }
        ]
    },
    "table_name": "users",
    "route_name": "users"
}

Common Inputs: 
axios object:
server params:
server route:
modalParams.loading
modalParams.saving
error state?

*/
const moment = require('moment')
const field_functions  = require("@/library/app_functions/field_functions")
const qparams = require('@/library/query_params.js')

//need batch string?

async function Test(axios_object) {
    var dx = await axios_object.post('appointments/get',
    {
    // "user_id": 1,
    "pagination": {"offset": 0, "limit": 5},
    "rules": [{}]
    }
    )

    return dx
}




async function RunQuery(route_name, query_routes, where, order_by, pagination, get_route_params,field_variables, axios_object,is_next_page) {
    /*
    This is the first function needed to run data pull from the server. The query_names come from the selected query_route in the
    Query Types modal window. The where, order_by and pagination modules are pulled from the objects to create the query params object
    to send to the server. field_variables contains parameters needed to process the data pulled for the server to be added to the
    client grid. 

    query_routes: { //need to have save route inorder to define how default values will be added
            'current_cfte(i)': {'route':'/route/path/insert', 'input_params': {'__save_route__': 'insert'} , 'description': 'New cfte. on save will try to create a new row'},
            'current_cfte(u)': {'route':'/route/path/update', 'input_params': {'__save_route__': 'update'} , 'description': 'current cfte. on save will try to update current row'},
            'new_providers': {'route':'/route/path/update', 'input_params': {'__save_route__': 'insert'} , 'description': 'Assigned providers without a cfte'},
            'default': {'route':'/route/path/update', 'input_params': {'__save_route__': 'update'} , 'description': 'Assigned providers without a cfte'},
            // 'save': //
    }

    [{'variable_name': , 'query_type': , 'value':  , 'data_type': ''}]
    New Sheet should also initialzie get_route_params. Need to reset grid_rout_params

    Errors handled in navbar component.

    initialize get_route_params when initial RunQuery is ran.
    */
    var query_object = query_routes[route_name]
    if (!is_next_page) {
        //initialize get_route_params
        var queryParams = { 'where': where, 'order_by': order_by, 'pagination': pagination}
        var grid_query_params = qparams.CreateGetRouteParams(queryParams) 
        
        get_route_params['current_get_route'] = query_object['route']
        get_route_params['input_params'] = query_object['input_params']
        get_route_params['where']      = grid_query_params['where']
        get_route_params['order_by']   = grid_query_params['order_by']
        get_route_params['pagination'] = grid_query_params['pagination']
        get_route_params['route_name'] = route_name
    }


    var server_params = {
        'where': get_route_params['where'],
        'order_by': get_route_params['order_by'],
        'pagination': get_route_params['pagination']
        // 'user_id': 1
    }
    var server_route = query_object['route']

    var dx = await axios_object.post(server_route,server_params)
    var output = dx.data
    var processedOutput =  ProcessServerDataForAggrid(output['rows'], get_route_params['input_params'], field_variables)
    //if error throw?

    return processedOutput
    //if no errors? else //Add error to loadModule?

    // clearRowData
    // appendData
}

function ProcessServerDataForAggrid(serverRowData, input_params, field_variables) {
    /*
    Loops through all the data pulled from the server and appends default parameters needed to populate the
    grid with the correct functionaliaty

    */
    var processedRowData = []
    for (let i =0; i < serverRowData.length; i++ ) {
        let rowx = ServerRowDefaultValues(serverRowData[i], input_params, field_variables)
        processedRowData.push(rowx)
    }
    return processedRowData
}




function ServerRowDefaultValues(serverRow, input_params, field_variables) {
    /*
    This function converts data pulled from the server into the required form for the client side.
    Need a timestamp component parser for updated_at.
    */
    //set default values
    var rowx = {}
    for (const key in input_params) {
        rowx[key] = input_params[key] 
    }

    var field_list = field_variables['fields']
    var field_map  = field_variables['field_map']
    // console.log(field_list)
    let server_columns_not_null = 0
    let total_server_columns = 0
    // console.log('wtf')
    // console.log(serverRow)
    for (let i=0; i< field_list.length; i++) {
        let field_name = field_list[i]
        if (serverRow.hasOwnProperty(field_name)) {
            // console.log('inside loop')
            let data_type = field_map[field_name]['data_type']
            var server_value = serverRow[field_name]
            if (data_type === 'date') {
                server_value = ConvertServerDateToClientValue(server_value)
            }
            else if (data_type === 'autocomplete') {
                if (typeof server_value === "boolean") {
                    server_value = String(server_value)
                }
            } else if (data_type === 'boolean') {
                server_value = String(server_value)
            }

            //if boolean convert to string
            total_server_columns += 1
            if (server_value === null ) {server_columns_not_null += 1}
            rowx[field_name] = server_value
            rowx[field_functions.BackupFieldName(field_name)] = server_value
        }
    }
    if (serverRow.hasOwnProperty('allow_update')) {
        rowx[field_functions.allow_update()] = serverRow['allow_update']
    }
    if (serverRow.hasOwnProperty('allow_delete')) {
        rowx[field_functions.allow_delete()] = serverRow['allow_delete']
    }
    if (serverRow.hasOwnProperty('is_assigned')) {
        rowx[field_functions.is_assigned()] = serverRow['is_assigned']
    }

    if (server_columns_not_null > 0 && server_columns_not_null === total_server_columns) {
        rowx[field_functions.is_empty()      ] = false
        rowx[field_functions.is_complete()   ] = true
        rowx[field_functions.is_incomplete() ] = false
    } else if (server_columns_not_null === 0 ) {
        rowx[field_functions.is_empty()      ] = true
        rowx[field_functions.is_complete()   ] = false
        rowx[field_functions.is_incomplete() ] = false
    } else {
        rowx[field_functions.is_empty()      ] = false
        rowx[field_functions.is_complete()   ] = false
        rowx[field_functions.is_incomplete() ] = true
    }
    return rowx

}


async function SaveData( saveRows, save_route, server_fields, field_map, autocomplete_map, axios_object, saveModalParams  ) {
    /*
    This funciton processes the rows for saving into the final form. Each row is sent to its specific saving route in
    req_body object. A temporary object is created row_map which stores a temporary node_id value -> save_row. This
    is used to allow the returned output to be matched to the saveRow so an error message can be added to it if the
    row fails to be saved.

    Date fields are changed to YYYY-MM-DD format. Autocomplete fields are processed to return the value generally the
    id needed to save to the server.
    */

    var req_body = {
        // 'user_id': 1,
        'insert': [], 'update': [],
        'upsert': [], 'delete': []
    }
    row_map = {} // node_id -> saveRow
    //has row_error = ?
    var count = 0
    // var row_error_map = {}
    for(let i =0; i <saveRows.length; i++ ) {
        let rowx = saveRows[i]

        if(rowx[field_functions.is_deleted()] )  {
            count +=1
            req_body['delete'].push( ProcessData(rowx,row_map, i, server_fields, field_map, autocomplete_map, 'delete') )

        } else if(rowx[field_functions.save_route()] === 'insert' )  {
            count +=1
            req_body['insert'].push( ProcessData(rowx,row_map, i, server_fields, field_map, autocomplete_map, 'insert') )

        } else if(rowx[field_functions.save_route()] === 'update' )  {

            count +=1
            req_body['update'].push( ProcessData(rowx,row_map, i, server_fields, field_map, autocomplete_map, 'update') )

        }  else if(rowx[field_functions.save_route()] === 'upsert' )  {

            count +=1
            req_body['upsert'].push( ProcessData(rowx,row_map, i, server_fields, field_map, autocomplete_map, 'upsert') )
        } else {
            rowx['node_id'] = -1
        }

        if (count > 100 ) {
            UpdateModalSaveInformation(saveModalParams, req_body, count)
            await SendSaveDataAndProcessError(save_route, req_body, row_map, saveModalParams, axios_object)
            // UpdateModalRowErrorInformation(saveModalParams, row_error_map)
            //save data
            //count error messages
            //process errors
            count = 0
            req_body['insert'] = [] 
            req_body['update'] = []
            req_body['upsert'] = []
            req_body['delete'] = []
        }
    }
    if (count > 0) {
        UpdateModalSaveInformation(saveModalParams, req_body, count)
        await SendSaveDataAndProcessError ( save_route, req_body, row_map, saveModalParams, axios_object )
        // UpdateModalRowErrorInformation(saveModalParams, row_error_map)
    }
    //if error AddServerErrorMessagesToRow field_functions.server_error()
    // AddServerErrorMessagesToRow(saveRows, row_error_map)
}

function UpdateModalSaveInformation(saveModalParams, req_body, save_count) {
    saveModalParams['insert_count'] += req_body['insert'].length
    saveModalParams['update_count'] += req_body['update'].length
    saveModalParams['delete_count'] += req_body['delete'].length
    saveModalParams['upsert_count'] += req_body['upsert'].length
    saveModalParams['row_start'] += saveModalParams['row_end']
    saveModalParams['row_end']   += save_count
}

function UpdateModalRowErrorInformation(saveModalParams, number_errors) {
    saveModalParams['error_count'] += number_errors
}


async function SendSaveDataAndProcessError ( save_route, req_body, row_map, saveModalParams, axios_object  ) {
    /*
        This is the main save function it sends the data in req_body to the server. Any rows that are rejected
        an error message is added the the saveRow through the row_map object. Also a count of rejected rows
        is passed to the saveModalParams.
    */
    // console.log(req_body)
    var dx = await axios_object.post(save_route, req_body)
    let dx_data = dx.data
    // console.log(dx_data)
    AppendErrorsToRowData(row_map, saveModalParams, dx_data['output'])
    if (dx_data['error']['is_error']) {
        throw new Error(dx['error']['error_msg'])
    }

}



function AppendErrorsToRowData(row_map,saveModalParams, save_output) {
    /*
    Adds rejected row error mesages to the rowData in row_map
    */
    var error_count = 0
    var save_routes = ['insert', 'update', 'upsert', 'delete' ]
    for (let i =0; i<save_routes.length; i++ ) {
        let save_route = save_routes[i]
        let save_route_output = save_output[save_route]
        for (let j=0; j < save_route_output.length; j++ ) {
            let outx = save_route_output[j]
            if (outx['is_error']) {
                let node_id = outx['node_id']
                row_map[node_id][field_functions.server_error()] = outx['error_msg']
                error_count +=1
            }
        }
    }
    UpdateModalRowErrorInformation(saveModalParams, error_count)
}


function ProcessData(rowx,row_map, node_id, server_fields, field_map, autocomplete_map, save_route) {
    /*
        ProcessData to be sent to the server.
        need to add node_id for filtering purposes?

        //loop through server fields only?
        field_map = gridParams[field_variables][field_map]
        //determine what route to append to based on the row data route. i.e.
        row_data[__is_deleted__] if no id ignore
        if __save_route__ == 'insert'
        for (let i = 0: i< row_data.length; i++ ) {
            var key
            if (!field_map.hasOwnProperty())
{'field': "", 'backup_field': "", 'validation_field': "", 'data_type': "", 'is_server_field': false, 'has_validation': false }
        }
        //need to check length of object before appending?
    */
    var rowy = {}
    for (let i=0; i < server_fields.length; i++) {
        let field_name = server_fields[i]
        let lookup = field_map[field_name]
        let backup_field_name = lookup['backup_field']
        let data_type = lookup['data_type']
        let current_value = rowx[field_name]
        let backup_value = rowx[backup_field_name]
        //add node_id
        rowx['node_id'] = node_id
        rowy['node_id'] = node_id
        row_map[node_id] = rowx
        //
        if (save_route === 'update') { if (backup_value === current_value) {continue} }
        if (data_type === 'date') {
            current_value = ConvertDateValue(current_value)
            if (current_value === null ) {continue}
        }
        if (data_type === 'autocomplete') {
            let autocomplete_lookup = autocomplete_map[field_name]
            let crud_column_name = autocomplete_lookup['crud_value']
            let mfx = autocomplete_lookup['mapFunction']
            if (!mfx.hasOwnProperty(current_value)) {continue}
            current_value = mfx[current_value][crud_column_name]
            let return_field = autocomplete_lookup['return_field']
            if (return_field !== "") {field_name = return_field}
            //if autcomplete_lookup has return_field  then replace field with return field?
            //used when the name of the data being pulled is different than the save route?
        }
        rowy[field_name] = current_value
    }

    if (save_route === 'update' || save_route === 'delete') {
        //check type?
        rowy['id'] = rowx['id']
    }
    // rowy['last_modified_by_user_id'] = 1

    return rowy
}


function ConvertDateValue(date_val) {
    /*
    This converts the client date string into YYYY-MM-DD format which is the format used for postgres.
    */
    //verify if default date is valid date
    var date_formats = ['MM/DD/YYYY','YYYY-MM-DD','M/DD/YYYY','MM/D/YYYY','M/D/YYYY']

    var moment_date = moment(date_val, date_formats, true)
    if (moment_date.isValid()) {
        return moment_date.format('YYYY-MM-DD')
    }
    return null
}

function ConvertServerDateToClientValue(date_val) {
    /*
    Converts sever side date data into MM/DD/YYYY format.
    */
    //verify if default date is valid date
    var date_formats = ['MM/DD/YYYY','YYYY-MM-DD','YYYY-M-DD','YYYY-MM-D','YYYY-M-D','M/DD/YYYY','MM/D/YYYY','M/D/YYYY']

    var moment_date = moment(date_val, date_formats, true)
    if (moment_date.isValid()) {
        return moment_date.format('MM/DD/YYYY')
    }
    return null
}


async function CheckBlockingRows(rowData) {
    /*
    This loops though all rows in rowData and determines if any rows should be saved but have errors that
    should be fixed first

    */
    //need to update conditional. I dont think its right
    let count = 0
    for (let i=0; i<rowData.length; i++) {
        if (IsBlocking(rowData[i]) ) { count +=1 }
    }
    return count
}

async function ExtractRowsForSave(rowData) {
    /*
    This extracts all completed rows that should be sent to the server for saving.
    */
    //need to update conditional. I dont think its right
    let saveRows = []
    for (let i=0; i<rowData.length; i++) {
        if ( IsSaveRow(rowData[i])
        
        ) { saveRows.push(rowData[i]) }
    }
    return saveRows
}

function IsBlocking(rowx) {
    /*
    If the row meets teh criteria below it has sometype of error that should prevent the saving
    function from continue
    */
    if ( !rowx[field_functions.is_deleted()] && rowx[field_functions.is_changed()] && 
            ( rowx[field_functions.is_incomplete()] || rowx[field_functions.is_error()] ) ) {
               return true 
    } else { return false}
}

function IsSaveRow(rowx) {
    /*
    Filter passes if the row should be included for saving.

    If new row skip if deleted. if new row and is changed is complete and no error should pass

    if old row i.e. for update. Can change if 

    */
    if ( ( rowx[field_functions.is_new_row()] && !rowx[field_functions.is_deleted()] &&
            ( rowx[field_functions.is_changed()] && rowx[field_functions.is_complete()] 
            && !rowx[field_functions.is_error()]  ) 
         )
    ) {return true} 
    else if ( ( !rowx[field_functions.is_new_row()] &&
        (
            ( rowx[field_functions.is_changed()] && rowx[field_functions.is_complete()] 
            && !rowx[field_functions.is_error()]  ) || rowx[field_functions.is_deleted()]
        )
        ) 
    ) {return true}
    else {return false}
}



module.exports = {
    "Test": Test,
    "RunQuery": RunQuery,
    "SaveData": SaveData,
    "CheckBlockingRows": CheckBlockingRows,
    "ExtractRowsForSave": ExtractRowsForSave
}
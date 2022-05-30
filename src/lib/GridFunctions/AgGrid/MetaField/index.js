//meta field
//meta field name
//meta fiel backup

function IsError (params, validation_function_list) {
    /*
    Checks if all editable fields are null
    Loops through columns in row whos keys are in the keys variable. If any value is an empty string
    returns true. If a user enters into a cell and leaves, the grid by default leaves an empty string.

    need to change empty paramters
    */
    var is_error = false
    for (var i=0; i< validation_function_list.length; i++) {
        var is_valid = validation_function_list[i](params)
        if (!is_valid) {is_error = true}
    }
    params.data[field_functions.is_error()] = is_error
    return is_error
}

function IsEmpty (params,server_fields) { 
    //Determines if cell value is Null. If any value is empty its false
    for (var i=0; i< server_fields.length; i++) {
        var value = params.data[server_fields[i]]
        if (value !== null) {
            params.data[field_functions.is_empty()] = false
            return
        }
    }
    params.data[field_functions.is_empty()] = true
}


function IsComplete (params,server_fields) { 
    //Determines if cell value is Null. If any value is empty its false
    for (var i=0; i< server_fields.length; i++) {
        var value = params.data[server_fields[i]]
        if (value === null) {
            params.data[field_functions.is_complete()] = false
            return
        }
    }
    params.data[field_functions.is_complete()] = true
}


function IsIncomplete(params) {
    if( params.data[field_functions.is_complete()] || params.data[field_functions.is_empty()] ) {
        params.data[field_functions.is_incomplete()] = false
    } else {
        params.data[field_functions.is_incomplete()] = true
    }
}


//parameters for row
function IsChanged (params, server_fields) {
    //Determines if cell value is Null. If any value is empty its false
    // console.log(server_fields)
    for (var i=0; i< server_fields.length; i++) {
        var value = params.data[server_fields[i]]
        var backup_value = params.data[ field_functions.BackupFieldName(server_fields[i]) ]
        if (value !== backup_value ) {
            params.data[field_functions.is_changed()] = true
            return
        }
    }
    params.data[field_functions.is_changed()] = false
    return
}
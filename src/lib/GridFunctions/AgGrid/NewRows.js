function NewRowInputsInitialize(new_row_inputs, gridParams) {
    /*
    This initializes the new_row_inputs with default values if not already defined. new_row_inputs is used when creating new 
    rows via insert in grid_functions.js This is used to initialize new rows and its corresponding paramters.
        // New Row Inputs:
        // new_row_inputs = {} is an object passed from url page in pages folder. It contains parameters for what to put in each row
        //     when insert row is selected. Default ke:value pairs are used in place when their is not a value already in place.
        //new_row_inputs
    */
    var server_fields  = gridParams['field_variables']['server_fields']
    var default_params = field_functions.DefaultNewRouteParameters()

    for (let key in default_params) {
        if (query_row_inputs.hasOwnProperty(key)) {continue}
        new_row_inputs[key] = default_params[key]
    }

    for (let i =0; i < server_fields.length; i++) {
        if (query_row_inputs.hasOwnProperty(server_fields[i])) {continue}
        new_row_inputs[server_fields[i]] = null
    }

}

function QueryRouteRowInputsInitialize(query_row_inputs) {
    /*
    This function finish initializing the default parameters in query_row_inputs. This object is used to add default parameters 
    to each row for data pulled from the server. A common change is to set what route the row will goto on save. The default route is update.
    */
    var default_params = field_functions.DefaultUpdateRouteParameters()
    for (let key in default_params) {
        if (query_row_inputs.hasOwnProperty(key)) {continue}
        query_row_input[key] = default_params[key]
    }
}
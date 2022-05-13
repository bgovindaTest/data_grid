/*
//Value Setter Helper, selectData and AutocompleteParams are required for the autocomplete functionality

ValueSetterHelper modifies the return object from autocomplete into the form required for ag-grid. 
autocomplete returns an object containing a value where as ag-grid requires a primitive type i.e. 
string, interger, float.

selectData is a json object that contains the different labels and metadata (group values) that 
are displayed in the autocomplete drop down menu

AutocompleteParams contains the parameters to use ag-grid autocomplete for more information see

https://www.npmjs.com/package/ag-grid-autocomplete-editor
https://github.com/avallete/ag-grid-autocomplete-editor#readme

set value?

wrapped in function?
valueSetter: function (input_params) {
    //initalize the following from input_params. column_name, map_function, return_value, key_value, backup_key_value, map_backup_field
    //send initialize parameters to ValueGetterAndSetMap or some other function
    return function (params) {
        return ValueGetterAndSetterMap(params, column_name, map_function, return_value, key_value, backup_key_value, map_backup_field)
    }
The function is called in @/library/init_functions/function_init.js


*/
const moment = require('moment')

function ValueAutocompleteSetter(params, map_function, selectValues, columnName, return_value, column_match_string='__match_string__') {
    /*
    The setter is used for the autocomplete widget. If copy and paste is used it will search against the selectValues
    to try to find the correct row. If no or multiple rows are returned in will return the key_values otherwise it will
    return the return value. If entering in through the autocomplete widget it will return the key_value directly which should
    be available in the
    
    params: object sent from aggrid
    map_function: map function takes the key_value and returns corresponding row for autocomplete
    selectValues: json array contains values used in autocomplete. Used to search against for newValues if it is not an available
        key for the map_object
    column_match_string: the column created in selectValues. It should have a concatenations of all the columns and its what the key_value
        will search against when not found in the map_object
    columnName: name of the params.data[columnName] where key_value will be saved
    return_value: if the search is used to try to match the key_value to row in selectValues. If only one is found this will be the
        column value thats returned.
    */
   if (typeof params.newValue === 'undefined') { return false }
   if (params.newValue === params.oldValue) {return false}   
   if (params.newValue === null) {
       params.data[columnName] = null
       return false 
    }
    var key_value = params.newValue
    if (map_function.hasOwnProperty(key_value)) {
        params.data[columnName] = key_value
        return true
    }
    //Try search
    var mx = String(key_value).toLowerCase()
    var mx_array = mx.split(/[\s,]+/)
    var lookup_list = selectValues.filter((row) => {
        var match_string = row[column_match_string]
        var i = 0;
        for( i in mx_array) {
            if (match_string.indexOf(mx_array[i]) < 0) {return false}
        }
        return true
    })
    if (lookup_list.length===1) {
        params.data[columnName] = lookup_list[0][return_value]
        return true
    }
    if (key_value.trim() === "") {
        params.data[columnName] = null
        return true
    }

    params.data[columnName] = key_value
    return true
}

function ValueIntegerSetter(params, columnName) {
    var newx = params.newValue
    var oldx = params.oldValue
    if(typeof newx === 'undefined') {return false}
    newx = parseInt(newx)
    if (oldx === newx) {return false}
    if (isNaN(newx)) {
        params.data[columnName] = null
        return true
    } else {
        params.data[columnName] = newx
        return true
    }
}

function ValueFloatSetter(params, columnName) {
    var newx = params.newValue
    var oldx = params.oldValue
    if(typeof newx === 'undefined') {return false}
    newx = parseFloat(newx)
    if (oldx === newx) {return false}
    if (isNaN(newx)) {
        params.data[columnName] = null 
        return true
    } else {
        params.data[columnName] = newx
        return true
    }
}

function ValueDateSetter(params, columnName) {

    var date_formats = ['YYYY-MM-DD','YYYY-M-DD','YYYY-MM-D','YYYY-M-D', 'MM/DD/YYYY','M/DD/YYYY','MM/D/YYYY','M/D/YYYY']
    var afd = params.newValue
    var moment_date = moment(afd, date_formats, true)
    if (!moment_date.isValid()) { 
        params.data[columnName] = null
        return true
    }
    var new_date_string = moment_date.format('MM/DD/YYYY')
    var old_date_string = params.oldValue
    if (new_date_string === old_date_string) {return false}
    params.data[columnName] = new_date_string
    return true
}

function ValueStringSetter(params, columnName) {
    var newx = params.newValue
    var oldx = params.oldValue
    if(typeof newx === 'undefined') {return false}
    if(newx === null) {
        params.data[columnName] = null
        return false
    }
    newx = newx.trim()
    if (oldx === newx) {return false}
    if (newx === "") {
        params.data[columnName] = null 
        return true
    }
    params.data[columnName] = newx
    return true
}

function ValueAutocompleteSetterInputParams(input_params) {
    return function (params) {
        return ValueAutocompleteSetter(params, input_params['mapFunction'], input_params['selectValues'], 
            input_params['field'], input_params['return_value'])
    }
}

function ValueIntegerSetterInputParams(input_params) {
    return function (params) {
        return ValueIntegerSetter(params, input_params['field'])
    }
}


function ValueFloatSetterInputParams(input_params) {
    return function (params) {
        return ValueFloatSetter(params, input_params['field'])
    }
}

function ValueDateSetterInputParams(input_params) {
    return function (params) {
        return ValueDateSetter(params, input_params['field'])
    }
}

function ValueStringSetterInputParams(input_params) {
    return function (params) {
        return ValueStringSetter(params, input_params['field'])
    }
}



module.exports = {
    'ValueAutocompleteSetter': ValueAutocompleteSetter,
    'ValueIntegerSetter': ValueIntegerSetter,
    'ValueFloatSetter': ValueFloatSetter,
    'ValueDateSetter': ValueDateSetter,
    'ValueStringSetter': ValueStringSetter,
    'ValueAutocompleteSetterInputParams': ValueAutocompleteSetterInputParams,
    'ValueIntegerSetterInputParams': ValueIntegerSetterInputParams,
    'ValueFloatSetterInputParams': ValueFloatSetterInputParams,
    'ValueDateSetterInputParams': ValueDateSetterInputParams,
    'ValueStringSetterInputParams': ValueStringSetterInputParams
}
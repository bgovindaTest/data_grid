/*
This modules is responsible for the valueGetters option in Aggrid. The valueGetters are often used to display 
corresponding information from the Autocomplete functions or to make calculations based on other fields. 

For example, for providers an npi uniquely refers to a provider. The npi column will use the autocomplete widget
to place the correct npi. the provider_first name column will use the value from the npi column to display the value 
in the grid and to enter it into the rowData row object. Technically valueGetters should not set values, but this allows
the other columns to check for changes mainly for error checking.

This modual is responsible for calculating the cFTE values defined for the OneMinus and TimeBased
approaches.

The modual also valiates the data entered for calculations are valid numbers. If any of the inputs
are not valid null will be returned.

Each function requires the params object which contains all the data for the current row calling, 
and other functions in the ag-grid data grid.

If the key is not in the map object these function will return null

In Main Pages the initialization for below functions should run as follows.
valueGetter: function (input_params) {
    //initalize the following from input_params. column_name, map_function, return_value, key_value, backup_key_value, map_backup_field
    //send initialize parameters to ValueGetterAndSetMap or some other function
    return function (params) {
        return ValueGetterAndSetterMap(params, column_name, map_function, return_value, key_value, backup_key_value, map_backup_field)
    }
}
*/


function ValueGetterAndSetterMap (params, map_function,  display_field, display_field_backup, 
    autocomplete_field, autocomplete_backup_field, field) {
    /*
    This function is a wrapper around the ValueGetterMap. It displays the calculated field and also sets it in
    the rowData row which allows its to be accesed by
    params: object sent by aggrid
    map_function: created for the autocomplete. the map_function takes the value in ac_column_name and return the
        value from map_function[params.data[ac_column_name][column_filed]
    return_column_field: The value to return from the map_function
    ac_column_name: name of the column where the autocomplete is being used. the value from here is used for
        the getter calculation
    ac_column_backup_name: the backup value. if the params.data[ac_column_name] === params.data[ac_column_backup_name] 
        the column will return getter_column_backup_field
    getter_column_name: column name of getter column. required to set value to params.data[getter_column_name]
    getter_column_backup_field: this is what is returned when params.data[ac_column_name] === params.data[ac_column_backup_name]
    */
    var dx = ValueGetterMap(params, map_function,  display_field, display_field_backup, 
        autocomplete_field, autocomplete_backup_field)
    params.data[field] = dx //whats column name?
    return dx
}

function ValueGetterSetterMapInputParams(input_params) {
    return function (params) {
        return ValueGetterAndSetterMap(params, input_params['mapFunction'], input_params['display_field'],
            input_params['display_field_backup'],  input_params['autocomplete_field'], input_params['autocomplete_backup_field'],
            input_params['field'])
    }
}




function ValueGetterMap(params, map_function,  display_field, display_field_backup, 
    autocomplete_field, autocomplete_backup_field) {
    /*
    This function is a wrapper around the ValueGetterMap. It displays the calculated field and also sets it in
    the rowData row which allows its to be accesed by
    params: object sent by aggrid
    map_function: created for the autocomplete. the map_function takes the value in ac_column_name and return the
        value from map_function[params.data[ac_column_name][column_filed]
    return_column_field: The value to return from the map_function
    ac_column_name: name of the column where the autocomplete is being used. the value from here is used for
        the getter calculation
    ac_column_backup_name: the backup value. if the params.data[ac_column_name] === params.data[ac_column_backup_name] 
        the column will return getter_column_backup_field
    getter_column_name: column name of getter column. required to set value to params.data[getter_column_name]
    */

    if (params.data[autocomplete_field] === null) {return null} 
    if ( params.data[autocomplete_field] === params.data[autocomplete_backup_field] ) {
        if (params.data.hasOwnProperty(display_field_backup)) {
            return params.data[display_field_backup]
        } else { return null }
    }
    return AutoCompleteReturn(params, map_function, autocomplete_field, display_field)
} //reject if not in map?

function AutoCompleteReturn(params, map_function, autocomplete_field, display_field) {
    /*
    This function return the value autocomplte value if the ac_column_name value is in 
    the map_function. Otherwise it return null
    */
    var key_value = params.data[autocomplete_field]
    if (! map_function.hasOwnProperty(key_value)) {return null} 
    else  {
        if (key_value === null) {return null}
        return map_function[key_value][display_field]        
    }
}


function ValueGetterMapInputParams(input_params) {
    return function (params) {
        return ValueGetterMap(params, input_params['mapFunction'], input_params['display_field'],
            input_params['display_field_backup'],  input_params['autocomplete_field'], input_params['autocomplete_backup_field'] )
    }
}


function ValueGetterLawsonCfte(input_params) {

    /*
    The 1Minus approach uses the Lawson FTE and other known physician time allocations to calculate the cFTE.
    The 1Minus approach splits physician effort into four categories: academic, administrative, contract work, and veteran’s affairs (VA).
    Each category should range from zero to one. With zero having no effort and one representing full time engagement.
    Below is how the cFTE using the 1minus approach is calculated.

    cFTE_1M = Lawson_FTE – (academic+administrative+consulting+veteransAffairs)

    This Value Getter will also set the cfte value to the row data so that the error function can check if in bounds.
    */
return function(params) {
    var dx = params.data
    var lawsonFTE      = dx['lawson_fte']
    var academic       = dx['academic']
    var contract    = dx['contract']
    var va             = dx['veterans_affairs']
    var administration = dx['administration']
    if (lawsonFTE === null || academic === null || contract === null 
        || va === null || administration === null) {
            params.data[ input_params['validation_field']] = true
            return null 
    }
    var total = academic + contract + va + administration
    var cFTE = lawsonFTE - total
    params.data['cfte'] = cFTE
    cFTE = cFTE.toFixed(3)
    //check for any invalid fields

    //if so set error


    if (cFTE >= 0 && cFTE <= 1) {
        // params.data[ input_params['validation_field']] = true
        return cFTE
    } else {
        // params.data[ input_params['validation_field']] = false
        // params.data[ input_params['__is_error__']] = true
        return cFTE 
    }


}
}

function ValueGetterTimeBasedCfte(params) {
        /*
        Time based is a cFTE reporting approach where full time effort is decided by each department.
        Work can be defined in two ways: shifts and sessions. Each department decides on how many shifts and sessions is considered full time.
        Each department may have a different time duration for shifts and sessions.

        Example 1:

        A department work patterns consist of 6 half day sessions and 2 shifts per week. Each half day session
        is 4 hours and each shift is 8 hours.
        
        A physician who has a normal work assignment of 3 half day sessions and 1 shift 
        
        totalFullTimeCfte = (hoursPerShift)*(numberShifts) + (hoursPerSession)*(numberSessions) = 8*2 + 4*6 = 40
        hoursWorkedByPhysician = (hoursPerShift)*(numberShiftsWorked) + (hoursPerSession)*(numberSessionsWorked) = 8*1 + 4*3 = 20

        cFTE = hoursWorkedByPhysician/totalFullTimeCfte = 20/40 = 0.5
        */
       var dx = params.data
       var shifts       = dx['shifts']
       var sessions     = dx['sessions']
       var workPlanShifts   = dx['max_shifts']
       var workPlanSessions = dx['max_sessions']
       var timePerShift     = dx['time_per_shift']
       var timePerSession   = dx['time_per_session']

       //need to convert to float first.


       var total = 0.0
       var numerator = 0
       //Create Denominator
       if ( !IsNull(timePerSession)  && !IsNull(workPlanSessions)) { total += workPlanSessions*timePerSession }
       if ( !IsNull(timePerShift)  && !IsNull(workPlanShifts)) { total += workPlanShifts*timePerShift }

       //Create Numerator 
       if ( !IsNull(sessions)  && !IsNull(timePerSession)  && !IsNull(workPlanSessions)) { numerator += sessions*timePerSession }
       if ( !IsNull(shifts)  && !IsNull(timePerShift)  && !IsNull(workPlanShifts)) { numerator += shifts*timePerShift }

       if (total === 0 ) {return null} //make cfte error on total is zero?
       var cFTE = numerator/total
       params.data['cfte'] = cFTE
       return cFTE
}

function NumberDisplay(input_params) {
    var field = input_params['field']
    return function (params) {
        if (params.data[field] === null ) {
            return null
        } else {
            return String(params.data[field])
        }
    }
}


function IsNull (numx) {
    /*
    This is used to verify the data entered is a number. numx will be used in calculations requiring a number.
    */
    if ( numx === null ) {return true}
    else if ( numx === undefined ) {return true}
    else if (isNaN(numx)) {return true}
    else { return false}
}

export default {
    'ValueGetterAndSetterMap': ValueGetterAndSetterMap,
    'ValueGetterMap': ValueGetterMap,
    'ValueGetterLawsonCfte': ValueGetterLawsonCfte,
    'ValueGetterTimeBasedCfte': ValueGetterTimeBasedCfte,
    'ValueGetterMapInputParams': ValueGetterMapInputParams,
    'NumberDisplay': NumberDisplay,
    'ValueGetterSetterMapInputParams': ValueGetterSetterMapInputParams
}


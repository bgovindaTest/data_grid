/*
Initializes value_setters, value_getters, validations, cell_style, and editable function

input_params is an object that contains parameters and values by the initialization functions inorder
to create the final function sent to aggrid api.

For data_type =map the input_params must contain autocomplete_field and display_field defined in the page folder.

Values stored in input_params. If the values are already in the object they will be overwritten. The naming conentions
below should not be used.

//everything with the name field should be a key in the rowData object except for display_field
//below are the fields that will be available to the initialization function on init.
input_params.gridParams the main gridParams object
input_params.autocomplete_map:

input_params.field = the field name of the column. Whats stored in grid_column_rule
input_params.validation_field = the name of the validation field
input_params.backup_field = name of backup field parameters.
input_params.data_type = ""
input_params.autcomplete_field = "the column field where the map function checks for the key"
input_params.autocomplete_backup_field = "the column field where the map function checks for the backup key value"
input_params.dispaly_field = this is the name of the column to return in the autocomplete selection options. for example if
    the npi column has a valid npi. this will use the value in that row/column to display the first name. for that 
    display_field == 'first_name'

//For autocomplete
input_params.mapFunction    = autocomplete_map[field][mapFunction]
input_params.return_value   = autocomplete_map[field][mapFunction]
input_params.selectValues   = autocomplete_map[field][mapFunction]

//Minimum requirements for data_type=map
in input_params autocomplete_field and display_field was be defined at initiaition.


Initialization Function Structure.

init_object = {'function': function, 'input_params': {} }
init_object = primative type.
init_object = function (params) {}
init_object = {} //doesnt have input_params.

validation functions must follow the structure
init_object = {'function': function, 'input_params': {} }
its not an actual field for aggrid and has specialy paramters for initizialization.

cell_style in the grid_rules array should have the form
function (input_params) {
    //initialize paramters for return function
    return function (params) {
        //use paramters from input_params
        //make some calculations
        //set value in error column
        //return true if error and false otherwise.
    }
}

All initialization functions must return a function that accepts one input params. The params
is what is sent to the function during each call.

New Row Inputs:
new_row_inputs = {} is an object passed from url page in pages folder. It contains parameters for what to put in each row
    when insert row is selected. Default ke:value pairs are used in place when their is not a value already in place. 
*/
// import field_functions from "@/library/app_functions/field_functions"
const field_functions = require('@/library/app_functions/field_functions')


function CLOG() {console.log('hi from function init')
    // field_functions.CLOG()
}


function InitializeStyleGetSetValidEditFunctions(grid_column_rule, gridParams, columnDef, validation_function_list) {

    //get input_params
    CellStyleInit(grid_column_rule, gridParams, columnDef)
    EditInit(grid_column_rule, gridParams, columnDef)
    ValueSetterInit(grid_column_rule, gridParams, columnDef)
    ValueGetterInit(grid_column_rule, gridParams, columnDef)
    ValidationInit(grid_column_rule, gridParams,validation_function_list, columnDef)
    ValueFormatterInit(grid_column_rule, gridParams, columnDef)
}

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



function ProcessInputParams(input_params, grid_column_rule, gridParams ) {
    /*
    This function initializes the input_params object used to initialize functions for
    validations, cellStyle, is editable, valueSetters and ValueGetters. Required values contained in the 
    grid_column_rule are passed to the input_params for initialization conveince.

    validation field is the error column
    */
    //add or create input_params
    input_params['gridParams'] = gridParams
    input_params['autocomplete_map'] = gridParams['autocomplete_map']
    input_params['user_permissions'] = gridParams['user_permissions']

    if (! grid_column_rule.hasOwnProperty('field') ) {
        if (grid_column_rule.hasOwnProperty('data_type')) { input_params['data_type'] = grid_column_rule['data_type'] }
        return
    }
    var field = grid_column_rule['field']
    var field_map = gridParams['field_variables']['field_map']
    var dx = field_map[field]

    input_params['field'] = field
    input_params['validation_field'] = dx['validation_field']
    input_params['backup_field'] = dx['backup_field']
    input_params['data_type'] = dx['data_type']



    if (input_params['data_type'] === 'map') {
        //this means the grid_rule requires map? has data_type map?
        //map requires two things to be entered. autocomplete_field and display_field
        //display_field should be entered by user in main page.
        // console.log(input_params)
        // console.log(input_params['autocomplete_map'])
        // console.log(input_params['autocomplete_field'])
        // var ac = input_params['autocomplete_map']
        // (params, input_params['mapFunction'], input_params['display_field'],
        // input_params['display_field_backup'],  input_params['autocomplete_field'], input_params['autocomplete_backup_field'] )

        // console.log(ac)
        // var mfx = ac[ input_params['autocomplete_field'] ]
        // console.log(mfx)
        // console.log(input_params)

        //dangerous but need conditional to skip. Send warning?
        //skip this part for everything thats not a getter?
        var autocomplete_lookup = input_params['autocomplete_map'][input_params['autocomplete_field']]
        input_params['mapFunction'] = autocomplete_lookup['mapFunction']
        input_params['return_value'] = autocomplete_lookup['return_value']
        input_params['selectValues'] = autocomplete_lookup['selectValues']
        input_params['autocomplete_backup_field'] = field_functions.BackupFieldName( input_params['autocomplete_field']  )
        input_params['display_field_backup'] = field_functions.BackupFieldName(  input_params['display_field']  )
        return
    }

    if (input_params['data_type'] === 'autocomplete') {
        //this means the grid_rule requires map? has data_type map?
        //map requires two things to be entered. autocomplete_field and display_field
        //display_field should be entered by user in main page.
        input_params['mapFunction']  = input_params['autocomplete_map'][field]['mapFunction']
        input_params['return_value'] = input_params['autocomplete_map'][field]['return_value']
        input_params['selectValues'] = input_params['autocomplete_map'][field]['selectValues']
        return
    }
}

//Append value to columnDef
//check if value exists?
//check if primitive type
function CellStyleInit(grid_column_rule, gridParams, columnDef) {
    /*
    This funciton initializes the celltyles
    */

    if (!grid_column_rule.hasOwnProperty('cellStyle')) {return}
    var cellStyleObject = grid_column_rule['cellStyle']
    if (IsPrimitiveType(cellStyleObject) ) {
        columnDef['cellStyle'] = cellStyleObject
        return
    }
    if (!grid_column_rule['cellStyle'].hasOwnProperty('input_params') ) {
        console.log(grid_column_rule)
        throw new Error("Missing input params")
        // grid_column_rule['cellStyle']['input_params'] = {}
    }
    var input_params = grid_column_rule['cellStyle']['input_params']
    // console.log(input_params)
    ProcessInputParams( input_params, grid_column_rule, gridParams )
    var fnx = grid_column_rule['cellStyle']['function']
    columnDef['cellStyle'] = fnx(input_params)
}

function EditInit(grid_column_rule, gridParams, columnDef) {
    /*
    Will generally need user permissions for this.
    editableFunction in the grid_rules array should have the form
    function (input_params) {
        //initialize paramters for return function
        return function (params) {
            //use paramters from input_params
            //make some calculations
            //set value in error column
            //return true if error and false otherwise.
        }
    }
    */
    if (!grid_column_rule.hasOwnProperty('editable')) {return}
    var editableObject = grid_column_rule['editable']
    if (IsPrimitiveType(editableObject) ) {
        columnDef['editable'] = editableObject
        return
    }
    if (!grid_column_rule['editable'].hasOwnProperty('input_params') ) {
        console.log(grid_column_rule)
        throw new Error("Missing input params")

        // grid_column_rule['editable']['input_params'] = {}
    }
    var input_params = grid_column_rule['editable']['input_params']
    ProcessInputParams( input_params, grid_column_rule, gridParams )
    var fnx = grid_column_rule['editable']['function']
    columnDef['editable'] = fnx(input_params)  
}

function ValueSetterInit(grid_column_rule, gridParams, columnDef) {
    /*
    value_setter functions in the grid_rules array should have the form
    function (input_params) {
        //initialize paramters for return function
        return function (params) {
            //use paramters from input_params
            //make some calculations
            //return final value
        }
    }
    */
   if (!grid_column_rule.hasOwnProperty('valueSetter')) {return}
   var valueSetterObject = grid_column_rule['valueSetter']
   if (IsPrimitiveType(valueSetterObject) ) {
       columnDef['valueSetter'] = valueSetterObject
       return
   }
   if (!grid_column_rule['valueSetter'].hasOwnProperty('input_params') ) {
       console.log(grid_column_rule)
       throw new Error("Missing input params")
    //    grid_column_rule['valueSetter']['input_params'] = {}
   }
   var input_params = grid_column_rule['valueSetter']['input_params']
   ProcessInputParams( input_params, grid_column_rule, gridParams )
   var fnx = grid_column_rule['valueSetter']['function']
   columnDef['valueSetter'] = fnx(input_params)
}

function ValueFormatterInit(grid_column_rule, gridParams, columnDef) {
    /*
    value_setter functions in the grid_rules array should have the form
    function (input_params) {
        //initialize paramters for return function
        return function (params) {
            //use paramters from input_params
            //make some calculations
            //return final value
        }
    }
    */
   if (!grid_column_rule.hasOwnProperty('valueFormatter')) {return}
   var valueSetterObject = grid_column_rule['valueFormatter']
   if (IsPrimitiveType(valueSetterObject) ) {
       columnDef['valueFormatter'] = valueSetterObject
       return
   }
   if (!grid_column_rule['valueFormatter'].hasOwnProperty('input_params') ) {
        console.log(grid_column_rule)
        throw new Error("Missing input params")
    //    grid_column_rule['valueFormatter']['input_params'] = {}
   }
   var input_params = grid_column_rule['valueFormatter']['input_params']
   ProcessInputParams( input_params, grid_column_rule, gridParams )
   var fnx = grid_column_rule['valueFormatter']['function']
   columnDef['valueFormatter'] = fnx(input_params)
}



function ValueGetterInit(grid_column_rule, gridParams, columnDef) {
    /*
    valueGetter initialization function
    */
    if (!grid_column_rule.hasOwnProperty('valueGetter')) {return}
    var valueGetterObject = grid_column_rule['valueGetter']
    if (IsPrimitiveType(valueGetterObject) ) {
        columnDef['valueGetter'] = valueGetterObject
        return
    }
    if (!grid_column_rule['valueGetter'].hasOwnProperty('input_params') ) {
        console.log(grid_column_rule)
        throw new Error("Missing input params")
        // grid_column_rule['valueGetter']['input_params'] = {}
    }
    var input_params = grid_column_rule['valueGetter']['input_params']
    // console.log(input_params)
    ProcessInputParams( input_params, grid_column_rule, gridParams )
    var fnx = grid_column_rule['valueGetter']['function']
    columnDef['valueGetter'] = fnx(input_params)

}

function ValidationInit(grid_column_rule, gridParams,validation_function_list) {
    /*
    This function initialization the validation function. Its appened to validation_function list. This is
    used by the NodeId column to check and set all validation parameters. Validation function must set their
    parameters to true or false based of if its valid. It must also return a boolean value based on if the
    validation passed or not.
    */
    if (!grid_column_rule.hasOwnProperty('validation')) {return}
    if (!grid_column_rule['validation'].hasOwnProperty('input_params') ) {
        grid_column_rule['validation']['input_params'] = {}
    }
    var input_params = grid_column_rule['validation']['input_params']
    ProcessInputParams( input_params, grid_column_rule, gridParams )
    var fnx = grid_column_rule['validation']['function']
    validation_function_list.push( fnx(input_params) )
}


function IsPrimitiveType(objectx) {
    //checks if object is primitative type?
    if (typeof objectx === "boolean") {return true}
    else if (typeof objectx === "number") {return true}
    else if (typeof objectx === "string") {return true}
    else if (typeof objectx === "function") {return true}
    else if (typeof objectx === "object" && objectx !== null ) {
        if (objectx.hasOwnProperty('input_params')) {return false}
        else {
            return true
        }

    }

    else {return false}

}

//check if primitive type. if so just set?
//Default Value Setter.
//date, integer, float, string
//string if empty return null
module.exports ={
    'InitializeStyleGetSetValidEditFunctions': InitializeStyleGetSetValidEditFunctions,
    'NewRowInputsInitialize': NewRowInputsInitialize,
    'QueryRouteRowInputsInitialize': QueryRouteRowInputsInitialize,
    'CLOG': CLOG
}
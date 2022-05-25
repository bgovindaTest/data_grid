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
/*
grid_init.js is the main module to initialize the app.

Grid Rules: For input types that accept function or objects the final return structure has the form.
function (params) { function actions }. Aggrid sends params to each function defined in the columnDefs. Params
is an object that allows the function to interact directly with aggrid.

If the type is found to be an object its expected to have the form: {'func': function, 'params': parameters }
The function takes the parameters object and returns a function in the form function (params) { function actions }
This allows the rules to have function with parameters created in the main_grid.vue or defined by the user in each individual
page. The params object can contain values in each page. The grid_params may over write some values that are created during
main_page initialization.

Validations Array store in Row Column.

grid_params: {}
grid_column_rules: {}
axios_object:
autocomplete_map: {}, // fieldname -> {'selectValues': [{}], 'mapFunction': {return_value} -> select_value_row, 
    'return_value': 'map_function_key and value displayed in autocomplete cell', 'crud_value', 'crud_value'  }

//new row insert rule.


Parses grid_params and generates corresponding columnDef object for AgGrid. Add init_functions to grid_params
value setter requires field name.

grid_rules_object = {'function': function (input_params) { return function (params) {} }, 'input_params': {}}
grid_rules_object = {'function': function (input_params) { return primative_type }, 'input_params': {}}

grid_column_rules:   
    headerName: (string) Name of column displayed in aggrid table. If object is empty the value in field is used
    field: (string) column_name stored in each row in row_data. i.e.
        rowData = [ {'field_name': value11, 'field_name2': value12}, {'field_name': value21, 'field_name2': value22} ]
    valueGetter: (string or grid_rules_object) for row_id = "node.id". This is a computed value that displays a value in
        a cell based on a set of calculations. Will also often contain a function to set the value of the cell based on the
        calculated data. The valueGetter function fires everytime a value in a row changes.
    valueSetter: (optional) (grid_rules_object). 
    width: (integer or grid_rules_object). Generally an integer. Sets the intial width of the columns 
    suppressMenu: (boolean) should generally be set to true.  
    cellStyle: (javascript_css object i.e. {'background-color':'red'} or grid_rules_object). This function controls the style
        of each cell. If its a funciton its fired everytime the row changes.  
    resizable: (boolean) default should set to true,
    lockVisible: (boolean) default should set to true
    editable: (boolean or grid_rules_object): Used to determine if a user can click into a cell and edit the contents. The user_permissions get passed to
        input_params. so that the function can determine based on the user when to allow data to be edited. or you can use allowUpdate and allowDelete in rowData
        to make the decision
    is_server_field: (boolean) this is used by the grid_rules_object to determine if this column should be sent to the server. This is required sense editable
        field can take a function, which makes the information ambiguous if it should be sent to the server.
    sortable: (boolean) allows a user to sort by column on client side. Default set to true,
    has_backup? set in editable and backup fields on data pull
    validation: {grid_rules_object}: //creates error parameter and is hidden?
    data_type: (string) [integer, float, date, boolean, string, map, calculated, autocomplete] (map refers to cells who entries are filled by the autocomplete,
        calculated are values stored from a function thats not just a map.) data_types with calculated are run last as they often depend on data
        pulled from the server from the primative types. calculated are values stored from a function thats not just a map.) data_types with
        calculated are run last as they often depend on data pulled from the server from the primative types.

grid_column_rules Input Parameters: These also go in the grid_column_rules. It used to set the how user enters data. Two options are below.

1.) Default html text input
    cellEditor: 'agTextCellEditor'

2.) Autocomplete and Drop Down Widget. The autocomplete widget requires several parameters stored in cellEdtiorParams.
    selectValues: [{}] is a json array containing the data shown in the drop down and used in the autocomplete
    return_value: this is value displayed in the cell. Its also used as the key for the mapfunction i.e.
        mapfunction[key] -> id (or some other value). This process is completed during the save function route that sends
        the cell data to the database. This is often the id for the value to be stored in postgres.

    match_string: default __match_string__. Used as the name of the column to set match string value to. 
    match_string_function: function (row, match_string_name) 
        { return //concatenated rows in row[match_string_name]}. This function is run against every row and appends another column labeled
        as match_string_name. users inputs are compared to the text in the match_string_name in order to guide the autocomplete. The match string
        object is also passed to the value_setter as select_values so that the value setter can run on copy paste.
    column_info: json array. Has the header value which must match a value in the selectValues array. init_width is the width to used for the
        autocomplete table.
    map_route: if not empty this is the rest route to pull the map data to. This will overwride anythign previously stored in the selectValues placeholder.
        selectValues can be store statically at each page level when a static drop down is required and no table linking is required.
    map_params: This is a json object that is sent with the axios call with the map route. It can contain additional parameters for making data pull
        from server.

    crud_value: column_name value to send to the server. Often the return value and crud_value are different for example npi maybe stored in the
        cell for the users convience, but the postgres id for that row is sent to the database. 

        The crud_value, return_value and selectValues object are used to create the mapFunction which takes the return_value and uses its as a key
            against select values to return the crud_value. both the return_value and the crud_value should return unique values.

    cellEditorFramework: 'AutocompleteAg'
    cellEditorParams: {
        selectValues: selectValues,
        return_value: 'appointment_code', (return_value is used as the key for all maps using this column)
        column_info: [
            {header: "id" , init_width: 50},
            {header: "name", init_width: 50},
            {header: "username", init_width: 75 },
            {header: "email", init_width: 200 },
            {header: "phone", init_width: 150 },
            {header: "website", init_width: 100 }
        ]
        match_string: (string) default __match_string__
        match_string_function: function?
        map_route: string
        map_params: {} 
        crud_value: id
        map_function: //the map function is place here during initialization

    }

The Value Getters form maps must be run after all map data has been pulled by the server. This ensured by setting data_type to computed.
The value getter needs to be able to handle old data that is no longer stored in the table. This is done by storing a "backup" of the calculated
field hidden in the rowData object. Each data pull from the server pulls all the data and the corresponding join data. If the data belongs to a
calculated field its stored in the __fieldname_backup__ column which is hidden. If the column return value used to generate the map function is
the same as when it was pulled the calculated field will display __fieldname_backup__ below is an example of how this can be calculated.

ValueGetterForMap(params,map_object, primary_column, primary_column_backup, calculated_backup_column, return_value) ?
    var current_value = params.data[primary_column]
    var old_value = params.data[primary_column_backup]
    var cmap = map_object[primary_column]['map']
    var cfunction = map_object[primary_column]['function']
    if (params.value === null) {return null} //null is returned by autocomplete when nothing is found. potential
    if current_value === old_value:
        return params.data[calculated_backup_column]
    else if ( map_object.hasOwnProperty(current_value) ) {
        return map_object[current_value][return_value]
    }else if ( 
        //run filter and if only one value return return_value else return params.value
     )

Primitive type or object: The primative types are string, boolean, integer, number. If the value stored is not one of these
its assumed to have the format below. With an object that containts two values 'function' and 'input_params'. The agggrid parameters
can accept one of two things a function that accepts params as input. this is what is sent by aggrid on every call or it can be a
primative type.

validation:  {'function': function (input_params) { return function (params) {} }, 'input_params': {}}
cell_style:  {'function': function (input_params) { return function (params) {} }, 'input_params': {}}
valueGetter: {'function': function (input_params) { return function (params) {} }, 'input_params': {}}
valueSetter: {'function': function (input_params) { return function (params) {} }, 'input_params': {}}
editable:    {'function': function (input_params) { return function (params) {} }, 'input_params': {}}

Option 1: aggrid paramter has primitive type
cell_style: (boolean, number, string)

Option 2: return a function
function (input_params) {

    return function (params) {
        //return function has access to input_params. Use fo calculations.
        //return value
    }

}

Option 3: return a primative type:
function (input_params) {
    return function (params) {
        //return function has access to input_params. Use fo calculations.
        //return value
    }
}

#Grid Rules Object
grid_params: {
    defaultColDef: {},
    crudRouteOptions: {},
    insertRouteFunction: {} Determines how insert should initialize rows.
    saveRouteFunction: {}
    validation_functions: []
    additional: function ()
    //fields i.e. editable, backup, private?
}

grid_params: contains data for creating the default column object and crudOptions which defines how data will be saved to the server 

private_variables and parameters: these store backup values pulled from the grid or parameters used by the grid to determine row
level functionality
__fieldname__backup__: each field or computed map value has a backup that can be refrence. for editable fields the data is stored
    in the column field and the field_backup. This allows the grid to determine if values have been changed or allows referencing
    to historical data
__fieldname__is_valid__: ValueGetter and sets boolean?
__is_empty__: the is a funciton that requires the editable array. the editable array are all columns that should be checked for not null
    values if all values are null it returns true otherwise it returns false. Used to determine what crud operations to use.
__is_complete__: check if all rows have non null values
__is_changed__: compares editable fields to backups. if everything equivalent no change.
__is_incomplete__: checks all fields in the editable array per row. If a row has some values entered but not all it returns true. otherwise
    it returns false
__is_deleted__: this is a boolean value set by the user delete function. if delete is set this will be true otherwise it will be false. If
    __allow_delete__ is false this variable is not allowed to be set to true.
__save_route__: this determines what route data changes should be sent to i.e. insert/update/upsert. by default new rows are insert and
    data pulled from server are update.
__allow_update__: (boolean) data sent from server or set on new insert. Used to help determine if contents are editable. New rows will generally set this to
    true
__allow_delete__: (boolean) data sent from server or set on new insert. Used to help determine if contents are deletable. New rows will generally set this to
    true
__is_assigned__: (boolean) determines if the user has specialty permissions for this data type.
__is_query_row__: boolean. establishes if data is sent from server or created by insert on grid
__is_new_row__:  boolean determines if row should be treated as new row regardless if sent from server or created by the grid using insert.


grid_params['insertRouteFunction']: this is the initialization function to create the new row insert fuction. This function has the form 
    function (input_params) { return function () { }} the function returned is what is used to set the intial parameters for each row.
        input_params should pass three variables: all rowData fields, editable_fields, backup_fields and private_fields. As will as what
        to put in each field by default

grid_params['crudRouteOptions']: initalization function how to process and store data pulled from each route

grid_params['saveRouteFunction ']: 

returns:
mapFunctionObject:
mapObject:
columnDefs: {
    type: Array,
    required: true
} ,
defaultColDef: {
    type: Object,
    required: true
},
intialized grid rules
editable_fields:
backup_fields:
private_fields:
all_fields:
*/



const autocomplete_init  = require('@/library/init_functions/autocomplete_init')
const column_def_init    = require('@/library/init_functions/column_def_init')

//import create_automap


async function InitializeAggrid(gridParams, grid_column_rules, autocomplete_map, axios_object) {
    /*
    Initialize All Maps
    Initialize Validations
    Initialize RowNode
    Initialize columns in grid_row_rules
        Extract: editable_fields, backup_fields, private_fields
    Create Default New and Update Process Functions For Creating Rows: initializes rowData to have all 
        editable, backup and private_fields

    Create Default New and Update Process Functions For Sending Rows to the server: initializes rowData to have all 
        editable, backup and private_fields
    Append Server Error to columnDefs

    */
    //SetServerAndOtherDataFields?
    // await crud_functions.PullUserPermissions(gridParams)
    await autocomplete_init.InitializeAutocompleteMaps(grid_column_rules, autocomplete_map, axios_object, gridParams)
    var columnDefinitions = column_def_init.CreateColumnDefinitions(grid_column_rules, gridParams)
    // console.log(grid_column_rules)

    return columnDefinitions
}

function CheckGridRulesAndLogError(grid_rules) {

    //regular

    //Autocomplete
}
/*
Module is used to initialize columnDef and defaultColumnDefinitions

//Default Values
//Create Row Thingy
//DefaultColumnDef
//Missing Required fields:
//For General
//For Autocomplete
//Assing Default Values
//Assign Default Column Def Values

    headerName: (string) Name of column displayed in aggrid table. If object is empty the value in field is used
    field: (string) column_name stored in each row in row_data. i.e.
        rowData = [ {'field_name': value11, 'field_name2': value12}, {'field_name': value21, 'field_name2': value22} ]
    valueGetter: (grid_rules_object) This is a computed value that displays a value in
        a cell based on a set of calculations. Will also often contain a function to set the value of the cell based on the
        calculated data. The valueGetter function fires everytime a value in a row changes.
    valueSetter: (optional) (grid_rules_object). Need to add for date column?
    width: (integer or grid_rules_object). Generally an integer. Sets the intial width of the columns 
    suppressMenu: (boolean) should generally be set to true.  
    cellStyle: (grid_rules_object). This function controls the style of each cell. If its a funciton its fired everytime the row changes.  
    resizable: (boolean) default should set to true,
    lockVisible: (boolean) default should set to true
    editable: (boolean or grid_rules_object): Used to determine if a user can click into a cell and edit the contents. The user_permissions get passed to
        input_params. so that the function can determine based on the user when to allow data to be edited. or you can use allowUpdate and allowDelete in rowData
        to make the decision
    is_server_field: (boolean) this is used by the grid_rules_object to determine if this column should be sent to the server. This is required sense editable
        field can take a function, which makes the information ambiguous if it should be sent to the server.
    sortable: (boolean) allows a user to sort by column on client side. Default set to true,
    validation: {grid_rules_object}: //creates error parameter and is hidden?
    data_type: (string) [integer, float, date, boolean, string, map, autocomplete, calculated] (map refers to cells who entries are filled by the autocomplete,
        calculated are values stored from a function thats not just a map.) data_types with calculated are run last as they often depend on data
        pulled from the server from the primative types. calculated are values stored from a function thats not just a map.) data_types with
        calculated are run last as they often depend on data pulled from the server from the primative types.
*/

const function_init   = require('@/library/init_functions/function_init')
const field_functions = require('@/library/app_functions/field_functions')
const moment = require('moment')

function CreateColumnDefinitions(grid_column_rules, gridParams) {
    /*



    */
    var columnDefinitions = []
    var validation_function_list = []
    // CreateUpdatedAtColumn(grid_column_rules)
    field_functions.InitalizeRowDataFieldsDefinitions(grid_column_rules, gridParams )
    // function_init.CLOG()

    // function_init.CLOG()
    for (let i =0; i < grid_column_rules.length; i++) {
        var columnDef = {}
        var grid_column_rule = grid_column_rules[i]
        InitializeColumnDefinitions(columnDef, grid_column_rule)
        function_init.InitializeStyleGetSetValidEditFunctions(grid_column_rule, gridParams, columnDef,validation_function_list)
        ColumnDefDefaultParameters(columnDef)
        AddAutocompleteEditor(grid_column_rule, columnDef)
        AddDateComparator(grid_column_rule, columnDef) //checks if data_type === 'date'
        columnDefinitions.push(columnDef)
    }
    // //Need to initialize column def if not in grid_params.
    CreateNodeIdColumn(validation_function_list, gridParams, columnDefinitions)
    // CreateUpdatedAtColumn(columnDefinitions)
    CreateServerErrorColumn(columnDefinitions)
    return columnDefinitions
}

function AddAutocompleteEditor(grid_column_rule, columnDef) {
    // console.log(grid_column_rule)
    if (!grid_column_rule.hasOwnProperty('cellEditorFramework') ) {return}
    if (grid_column_rule['cellEditorFramework'] !== 'AutocompleteAg') {return}
    if (!grid_column_rule.hasOwnProperty('cellEditorParams')) {return}
    columnDef['cellEditorFramework'] = 'AutocompleteAg'
    cellEditorParams = {}
    if (grid_column_rule['cellEditorParams'].hasOwnProperty('selectValues') ) {
        cellEditorParams['selectValues'] = grid_column_rule['cellEditorParams']['selectValues']
    }
    if (grid_column_rule['cellEditorParams'].hasOwnProperty('return_value') ) {
        cellEditorParams['return_value'] = grid_column_rule['cellEditorParams']['return_value']
    }
    if (grid_column_rule['cellEditorParams'].hasOwnProperty('return_null') ) {
        cellEditorParams['return_null'] = grid_column_rule['cellEditorParams']['return_null']
    }
    if (grid_column_rule['cellEditorParams'].hasOwnProperty('column_info') ) {
        cellEditorParams['column_info'] = grid_column_rule['cellEditorParams']['column_info']
    }
    columnDef['cellEditorParams'] = cellEditorParams
}

function InitializeColumnDefinitions(columnDef, grid_column_rule) {
    /*
    Push column parameters to columnDef
    string for tool tip?
    */
    var column_params = ['headerName', 'field', ,'width', 'lockVisible', 'suppressMenu',
        'resizable', 'sortable', 'lockVisible', 'hide']
    for (let i = 0; i < column_params.length; i++ ) {
        var key = column_params[i]
        if (grid_column_rule.hasOwnProperty(key)) {columnDef[key] = grid_column_rule[key] }
    }
    if (!columnDef.hasOwnProperty('headerName') ) {
        if (columnDef.hasOwnProperty('field')) {
            columnDef['headerName'] = columnDef['field']
        }
    }
}


function AddDateComparator(grid_column_rule, columnDef) {
    /*
    Adds a function that allows aggrid client side to sort by the date.
    */
    if (grid_column_rule.hasOwnProperty('data_type') ) {
        if (grid_column_rule['data_type'] === 'date') {
            columnDef['comparator'] = AggridDateSortComparator
        } else if (grid_column_rule.data_type === 'datetime' ) {
            columnDef['comparator'] = AggridDateTimeSortComparator
        }
    }
}



function ColumnDefDefaultParameters(columnDef) {
    //if is display?
    //headerName if headerName doesnt exits headerName = field
    // only set if object doesnt exist
    var default_object = {'width': 300, 'editable': false, 'suppressMenu': true,
        'resizable': true, 'sortable': true, 'lockVisible': true}
    if (! columnDef.hasOwnProperty('headerName')) {columnDef['headerName'] = columnDef['field'] }
    for (var key in default_object) {
        if (! columnDef.hasOwnProperty(key)) {columnDef[key] = default_object[key] }
    }
}

function CreateServerErrorColumn(columnDefinitions) {
    /*
    Need to add cell style based on error or incomplete or complete or no change?
    allso color when set to delete
    */
    //server_data_array
    var server_error_field = field_functions.server_error()


    //validation_field list:
    var error_column = 
    {
        headerName: "ServerError",
        field: server_error_field,
        cellStyle: {'color':'red', 'background-color': 'rgba(189, 195, 199, 0.3)'},
        width: 250,
        hide: true,
        lockVisible: true
    }
    columnDefinitions.push(error_column)
}

function CreateUpdatedAtColumn(grid_column_rules) {
    /*
    Displays when last formated.
    */


    //validation_field list:
    var updated_at_column = 
    {
        headerName: "updated_at",
        field: "updated_at",
        data_type: 'datetime',
        cellStyle: { 'background-color': 'rgba(189, 195, 199, 0.3)'},
        width: 250,
        valueFormatter: function (params) {
            if (params.value === null) {return params.value}
            let dateAsString = params.value
            dateAsString = moment(moment( dateAsString))
            if (! dateAsString.isValid() ) {return null}
        
            dateAsString = dateAsString.format('MM/DD/YYYY HH:mm:ss')
            return dateAsString
        },
        lockVisible: true
    }
    updated_at_column['comparator'] = AggridDateTimeSortComparator

    grid_column_rules.push(updated_at_column)
}




function CreateNodeIdColumn(validation_function_list, gridParams, columnDefinitions) {
    /*
    Need to add cell style based on error or incomplete or complete or no change?
    allso color when set to delete
    */
    //server_data_array
    var server_fields = gridParams['field_variables']['server_fields']


    //validation_field list:
    var node_column = 
    {
        headerName: "NodeId",
        valueGetter: function (params) {
            IsEmpty(params, server_fields)
            IsComplete(params,server_fields)
            IsChanged(params,server_fields)
            IsIncomplete(params)
            var is_error = IsError(params, validation_function_list)
            // console.log(is_error)
            // // console.log(params.data)
            // params.api.refreshCells()
            if (is_error) {
                return  params.node.id + ' E'    
            } else {
                return  params.node.id
            }


        },
        lockPinned:true,
        pinned: 'left',
        cellStyle: function (params) {
            if (params.data[field_functions.is_deleted()]) {
                return {'border-color': '', 'color': '', 'border-width': 'thin', 'background-color': 'rgba(46, 49, 49, 0.5)'}
            } else {
                return {'border-color': '', 'color': '', 'border-width': 'thin', 'background-color': 'rgba(189, 195, 199, 0.3)'}
            }
        },
        width: 75,
        lockVisible: true
    }
    columnDefinitions.unshift(node_column)
}

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


function AggridDateSortComparator  (date1, date2) {
    //var dateAsString = moment(cellValue).format
    var dx1 = ConvertToDate(date1)
    var dx2 = ConvertToDate(date2)

    if (dx1 == null && dx2 == null) {return 0}
    if (dx1 == null) {return -1}
    if (dx2 == null) {return 1}
    // Now that both parameters are Date objects, we can compare
    if (dx1 < dx2) {
        return -1;
    } else if (dx1 > dx2) {
        return 1;
    } else {
        return 0;
    }
}

function AggridDateTimeSortComparator (date1, date2) {
    var dx1 = ConvertToDateFromDateTime(date1)
    var dx2 = ConvertToDateFromDateTime(date2)

    if (dx1 == null && dx2 == null) {return 0}
    if (dx1 == null) {return -1}
    if (dx2 == null) {return 1}
    // Now that both parameters are Date objects, we can compare
    if (dx1 < dx2) {
        return -1;
    } else if (dx1 > dx2) {
        return 1;
    } else {
        return 0;
    }
}


function  ConvertToDateFromDateTime (cellValue) {
    //var dateAsString = moment(cellValue).format;
    // console.log(cellValue)
    if (cellValue == null){ return null}
    var dateTimeAsString = moment(moment( cellValue))
    if (! dateTimeAsString.isValid() ) {return null}

    dateTimeAsString = dateTimeAsString.format('DD/MM/YYYY HH:mm:ss')

    let dateAsString = dateTimeAsString.split(' ')[0]
    let timeAsString = dateTimeAsString.split(' ')[1]
    let timeParts = timeAsString.split(':')
    let hh = timeParts[0]
    let mm = timeParts[1]
    let ss = timeParts[2]
    // In the example application, dates are stored as dd/mm/yyyy
    // We create a Date object for comparison against the filter date
    var dateParts = dateAsString.split("/");
    var day = Number(dateParts[2]);
    var month = Number(dateParts[1]) - 1;
    var year = Number(dateParts[0]);
    var cellDate = new Date(day, month, year, hh, mm, ss);
    return cellDate
}



function  ConvertToDate (cellValue) {
    //var dateAsString = moment(cellValue).format;
    if (cellValue == null){ return null}
    var dateAsString = moment(moment( cellValue, 'MM/DD/YYYY'))
    if (! dateAsString.isValid() ) {return null}

    dateAsString = dateAsString.format('DD/MM/YYYY')
    // In the example application, dates are stored as dd/mm/yyyy
    // We create a Date object for comparison against the filter date
    var dateParts = dateAsString.split("/");
    var day = Number(dateParts[2]);
    var month = Number(dateParts[1]) - 1;
    var year = Number(dateParts[0]);
    var cellDate = new Date(day, month, year);
    return cellDate
}

module.exports = {
    'CreateColumnDefinitions':CreateColumnDefinitions
}



module.exports = {
    'InitializeAggrid':InitializeAggrid
}


module.exports ={
    'InitializeStyleGetSetValidEditFunctions': InitializeStyleGetSetValidEditFunctions,
    'NewRowInputsInitialize': NewRowInputsInitialize,
    'QueryRouteRowInputsInitialize': QueryRouteRowInputsInitialize,
    'CLOG': CLOG
}
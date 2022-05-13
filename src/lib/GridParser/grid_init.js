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

module.exports = {
    'InitializeAggrid':InitializeAggrid
}
/*
This module is responsible for creating the names of all the fields (public and private) that are to be entered into each row
or used as row level calculation paramters. This module is repsonsible for appending field_variables object into the grid_params object.

Private variable start and end with two underscores. So this structure should be excluded from use as a field name.

is_server_field: added in grid_column_rules. Used to determine if data in that column should be sent to the server.

Initialize private variables

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

node_id: This is added to rows during the saving functionality. This is used as a mapping to connect server data errors to the row in rowData.
    This may or maynot be present but should not be added anywhere else within the program.

id: this column is required to be defined in each table. This is the corresponding id in postgresql. node_id and id are directly called and
    checked for on the server side.

InitalizeRowDataFieldsDefinitions is the main module and it returns:
gridParams['field_variables'] = {
    'fields': field_list, list of all columns that had field defined in it
    'backup_fields': field_backup_list, list of the field converted to their backup names
    'server_fields': server_field_list, list of fields that are the primary data points to be entered by the user.
        this data is saved to the server on save.
    'backup_server_fields': server_field_backup_list, backup name of the server fields
    'validation_fields': validation_fields, every data column field that also has the 'validation' object defined.
        this will contain a validation function. This module checks for its existance and ats the field to the list
        of fields that have validations to check for
    'validation_field_names': validation_field_names, the list of field names covereted to the private name for validation fields
        stored in 
    'error_fields': error_fields, All the fields used outside of the validations used to determine if a row is ready to be saved. i.e.
        its complete and has no error.
    'row_parameters': list of fields used to control row level behavior such as can delete, can update, is_assigned
    'field_map': {field} -> {'field': "", 'backup_field': "", 'validation_field': "", 'data_type': "", 'is_server_field': false, 'has_validation': false }
}

//Default crud options: When new rows are created or pulled from the server. Many of the private variables need to be initialized
The functions below contain the default parameter which can be overwritten in the main page.
DefaultNewRouteParameters
DefaultUpdateRouteParameters

*/

function CLOG () {console.log('hi from clog')}

function InitalizeRowDataFieldsDefinitions(grid_column_rules, gridParams ) {
    /*
    Adds field information to gridParams
    */
    var field_list = []
    var server_field_list = []
    var field_backup_list = []
    var server_field_backup_list = []

    var validation_fields = []
    var validation_field_names = []

    var field_map = {} //field, data_type, is_validation: , validation_field: itself, backup_field, is_private

    for (let i=0; i< grid_column_rules.length; i++) {
        var grid_column_rule = grid_column_rules[i]
        FieldAppend(field_list, field_backup_list, grid_column_rule)
        ServerFieldAppend(server_field_list, server_field_backup_list ,grid_column_rule)
        ValidationFieldParameters(validation_fields, validation_field_names, grid_column_rule)
        FieldMapAppend(field_map, grid_column_rule)
    }
    var error_fields = ErrorParamters()
    var row_parameters = GridParameters()

    gridParams['field_variables'] = {
        'fields': field_list,
        'backup_fields': field_backup_list,
        'server_fields': server_field_list,
        'backup_server_fields': server_field_backup_list,
        'validation_fields': validation_fields,
        'validation_field_names': validation_field_names,
        'error_fields': error_fields,
        'row_parameters': row_parameters,
        'field_map': field_map
    }
    //full list
}

function FieldMapAppend(field_map, grid_column_rule) {

    if (! grid_column_rule.hasOwnProperty('field')) { return  }
    var dx = {'field': "", 'backup_field': "", 'validation_field': "", 'data_type': "", 'is_server_field': false, 'has_validation': false }

    var field_name = grid_column_rule['field']

    dx['field'] = field_name
    dx['backup_field'] = BackupFieldName( field_name ) 

    if (grid_column_rule.hasOwnProperty('is_server_field')) {
        dx['is_server_field'] = grid_column_rule['is_server_field']
    }
    
    if (grid_column_rule.hasOwnProperty('validation')) {
        dx['validation_field'] = ValidationFieldName(grid_column_rule['field'] )
        dx['has_validation']   = true
    }

    if (grid_column_rule.hasOwnProperty('data_type')) {
        dx['data_type'] = grid_column_rule['data_type']
    }
    field_map[field_name] = dx

}

function FieldAppend(field_list, backup_field_list, grid_column_rule) {
    //name of fields entered by user.
    if (grid_column_rule.hasOwnProperty('field')) { 
        field_list.push(grid_column_rule['field'])
        backup_field_list.push( BackupFieldName( grid_column_rule['field'] ) )
    }
}

function ServerFieldAppend(server_field_list, server_field_backup_list, grid_column_rule) {
    //name of fields entered by user.
    if (grid_column_rule.hasOwnProperty('is_server_field')) {
        if (grid_column_rule['is_server_field']) {
            server_field_list.push(grid_column_rule['field'])
            server_field_backup_list.push( BackupFieldName( grid_column_rule['field']  ) )
        }
    }
}


function ValidationFieldParameters(validation_fields, validation_field_names, grid_column_rule) {
    //creates the field name in rowData for check validation
    if (grid_column_rule.hasOwnProperty('validation')) {
            validation_fields.push(  grid_column_rule['field'] )
            validation_field_names.push(  ValidationFieldName(grid_column_rule['field'] ) )
    }
}

function ErrorParamters() {
    //Calculated Fields. Fields are calculated by Aggrid NodeId column in getter row.
    //Maybe should initialize anyway?
    var error_fields =  ['__is_empty__', '__is_complete__', '__is_changed__', '__is_incomplete__', '__is_error__']
    return error_fields
}


function GridParameters() {
    /*
    These fields are controlled by user input. And query information. 

    */
    var grid_row_params = ['__is_deleted__',  '__save_route__', '__allow_update__', '__allow_delete__', '__is_assigned__',
        '__is_query_row__', '__is_new_row__', '__server_error_msg__']
    return grid_row_params
}


function DefaultNewRouteParameters() {
    var dx = {'__is_deleted__': false, '__save_route__': 'insert', '__allow_update__': true, '__allow_delete__': true, 
    '__is_assigned__': true,'__is_query_row__':false, '__is_new_row__':true, '__server_error_msg__': ""}
    return dx
}

function DefaultInsertRouteParameters() {
    var dx = {'__is_deleted__': false, '__save_route__': 'insert', '__allow_update__': true, '__allow_delete__': true, 
    '__is_assigned__': true,'__is_query_row__':true, '__is_new_row__':true, '__server_error_msg__': ""}
    return dx
}

function DefaultUpdateRouteParameters() {
    var dx = {'__is_deleted__': false, '__save_route__': 'update', '__allow_update__': false, '__allow_delete__': false, 
    '__is_assigned__': false, '__is_query_row__':true, '__is_new_row__':false, '__server_error_msg__': ""}
    return dx
}

function DefaultUpsertRouteParameters() {
    var dx = {'__is_deleted__': false, '__save_route__': 'upsert', '__allow_update__': true, '__allow_delete__': true, 
    '__is_assigned__': true, '__is_query_row__':true, '__is_new_row__':true, '__server_error_msg__': ""}
    return dx
}

function DefaultUndefinedRouteParameters() {
    var dx = {'__is_deleted__': false, '__save_route__': 'upsert', '__allow_update__': false, '__allow_delete__': false, 
    '__is_assigned__': false, '__is_query_row__':true, '__is_new_row__': false, '__server_error_msg__': ""}
    return dx
}


function InitalizeRowCreation(gridParams,new_input_params, query_routes ) {
    //default values to add to new rows based on input_params
    if (!new_input_params.hasOwnProperty('__save_route__') ) {
        new_input_params['__save_route__'] = 'insert'
    }
    //Initialize new route. Whats generated when using insert function
    AddDefaultParameters(new_input_params, DefaultNewRouteParameters() )
    AddDefaultParametersDefValue(new_input_params, gridParams['field_variables']['fields'], null)
    AddDefaultParametersDefValue(new_input_params, gridParams['field_variables']['backup_fields'], null)
    AddDefaultParametersDefValue(new_input_params, gridParams['field_variables']['server_fields'], null)
    AddDefaultParametersDefValue(new_input_params, gridParams['field_variables']['backup_server_fields'], null)
    AddDefaultParametersDefValue(new_input_params, gridParams['field_variables']['validation_field_names'], true)

    //add error statements?
    new_input_params['__is_empty__'] = true
    new_input_params['__is_complete__'] = false
    new_input_params['__is_changed__'] = false
    new_input_params['__is_incomplete__'] = false
    new_input_params['__is_error__'] = false

    // console.log(new_input_params )
    //Initializations for private rows? if now input_params: {}
    for (var key in query_routes ) {
        var query_params = query_routes[key]
        if (!query_params.hasOwnProperty('input_params')) { query_params['input_params'] = {'__save_route__': 'update'} }
        var input_params = query_params['input_params']
        var save_type = input_params['__save_route__']
        if (save_type === 'insert') {
            AddDefaultParameters(input_params, DefaultInsertRouteParameters())
        } else if (save_type === 'update') {
            AddDefaultParameters(input_params, DefaultUpdateRouteParameters() )
        } else if (save_type === 'upsert') {
            AddDefaultParameters(input_params, DefaultUpsertRouteParameters() )
        } else {
            AddDefaultParameters(input_params, DefaultUndefinedRouteParameters() )
        }
        //placeholders. Should be overwritting during initializations
        input_params['__is_empty__'] = false
        input_params['__is_complete__'] = false
        input_params['__is_changed__'] = false
        input_params['__is_incomplete__'] = true
        input_params['__is_error__'] = false
        AddDefaultParametersDefValueRoute(input_params, gridParams['field_variables']['fields'], null)
        AddDefaultParametersDefValueRoute(input_params, gridParams['field_variables']['backup_fields'], null)
        AddDefaultParametersDefValueRoute(input_params, gridParams['field_variables']['server_fields'], null)
        AddDefaultParametersDefValueRoute(input_params, gridParams['field_variables']['backup_server_fields'], null)
        AddDefaultParametersDefValueRoute(input_params, gridParams['field_variables']['validation_field_names'], true)
    }

}
function AddDefaultParametersDefValueRoute(input_params, field_list, default_value) {
    for (let i=0; i < field_list.length; i++) {
        if (!input_params.hasOwnProperty(field_list[i])) {
            input_params[field_list[i]] = default_value
        }

    }
}



function AddDefaultParametersDefValue(input_params, field_list, default_value) {
    for (let i=0; i < field_list.length; i++) {
        input_params[field_list[i]] = default_value
    }
}



function AddDefaultParameters(input_params, default_params) {
    for (var key in default_params ) {
        if (! input_params.hasOwnProperty(key)) {input_params[key] = default_params[key] }
    }
}


// function CreateInsertRules() {}

function PrivateVariableFieldName(fieldname) {
    //the structure of private varialbes
    return '__'+fieldname + '__'
}

function BackupFieldName(fieldname) {
    //the structure of backup varialbes
    //or calculated map fields
    return '__'+fieldname + '__backup__'
}

function ValidationFieldName(fieldname) {
    //the structure of backup varialbes
    //or calculated map fields
    return '__'+fieldname + '__is_valid__'
}

//Return Fields. So that raw strings are not being passed every where
function EditableFields(gridParams) {
    return gridParams['field_variables']['server_fields']
}

function NewRowParams(gridParams) { return gridParams['insert_row_params']}

function is_deleted () { return '__is_deleted__' }
function save_route () { return '__save_route__'}
function allow_update() { return '__allow_update__'}
function allow_delete () { return '__allow_delete__'}
function is_assigned () { return '__is_assigned__'}
function is_query_row () { return '__is_query_row__'}
function is_new_row () { return '__is_new_row__'}
function server_error () { return '__server_error_msg__'}

function is_empty () { return '__is_empty__'}
function is_complete () { return '__is_complete__'}
function is_changed () { return '__is_changed__'}
function is_incomplete () { return '__is_incomplete__'}
function is_error () { return '__is_error__'}

module.exports = {
    'CLOG': CLOG,
    'NewRowParams': NewRowParams,
    'PrivateVariableFieldName': PrivateVariableFieldName,
    'BackupFieldName': BackupFieldName,
    'ValidationFieldName': ValidationFieldName,
    'InitalizeRowDataFieldsDefinitions': InitalizeRowDataFieldsDefinitions,
    'DefaultUpdateRouteParameters': DefaultUpdateRouteParameters,
    'DefaultNewRouteParameters': DefaultNewRouteParameters,
    'InitalizeRowCreation': InitalizeRowCreation,
    'EditableFields': EditableFields,
    'is_deleted': is_deleted,
    'save_route': save_route, 
    'allow_update': allow_update,
    'allow_delete': allow_delete,
    'is_assigned': is_assigned,
    'is_query_row':is_query_row,
    'is_new_row': is_new_row,
    'server_error': server_error,
    'is_empty': is_empty,
    'is_complete': is_complete, 
    'is_changed': is_changed, 
    'is_incomplete': is_incomplete, 
    'is_error':is_error
}
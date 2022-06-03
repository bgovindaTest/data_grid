/*
/*

    'qparams_prefix':"",
    'url_prefix':"",
    '__init_params__':  {},
    '__url_params__': {},
    '__drop_downs__': {},
    '__is_read_only__':  true/false (do the have modification permssions)
        //if no force editable to false

    //first grid is main. others can be called as subgrids
    grids: [
        {'name': 'x'
         'help': ""
        'headerParams': {links}
        'crud_params': //i.e. new row, update, delete, etc read/etc
        'columnDef': //agrid info
        },
        {'name': 'y'
        'crud_params': //i.e. new row, update, delete, etc read/etc
        'columnDef': //agrid info
        },
    ]

    crudRoute:
        default: ->
        select:  ->
        insert:  ->
        update:  ->
        delete:  ->

    crudInsteadOf: {
        'insert': 'update'
    }



headerParams:
    new_sheet:
    allow_insert:



New Row Inputs:
new_row_inputs = {} is an object passed from url page in pages folder. It contains parameters for what to put in each row
    when insert row is selected. Default ke:value pairs are used in place when their is not a value already in place.
New Row defaults really needed for submodal behavior


columDefs: these keys are checked and modified based on initial entry. Everythign in columnDefs is passed to Aggrid.
    headerName: (string) Name of column displayed in aggrid table. If object is empty the value in field is used
    field: (string) column_name stored in each row in row_data. i.e.
        rowData = [ {'field_name': value11, 'field_name2': value12}, {'field_name': value21, 'field_name2': value22} ]
    valueGetter: (grid_rules_object) This is a computed value that displays a value in
        a cell based on a set of calculations. Will also often contain a function to set the value of the cell based on the
        calculated data. The valueGetter function fires everytime a value in a row changes.
    valueSetter: (optional) (grid_rules_object). Need to add for date column?
    valueFormatter: blah
    toolTip: expression for variables
    width: (integer or grid_rules_object). Generally an integer. Sets the intial width of the columns 
    suppressMenu: (boolean) should generally be set to true.  
    cellClassStyle: (grid_rules_object). This function controls the style of each cell. If its a funciton its fired everytime the row changes.  
    resizable: (boolean) default should set to true,
    lockVisible: (boolean) default should set to true
    editable: (boolean or grid_rules_object): Used to determine if a user can click into a cell and edit the contents. The user_permissions get passed to
        input_params. so that the function can determine based on the user when to allow data to be edited. or you can use allowUpdate and allowDelete in rowData
        to make the decision
    is_server_field: (boolean) this is used by the grid_rules_object to determine if this column should be sent to the server. This is required sense editable
        field can take a function, which makes the information ambiguous if it should be sent to the server.
        if is_editable is default server field along with id?
    validator: {grid_rules_object}: //creates error parameter and is hidden?
    data_type: (string) [integer, float, date, boolean, string, map, autocomplete, calculated] (map refers to cells who entries are filled by the autocomplete,
        calculated are values stored from a function thats not just a map.) data_types with calculated are run last as they often depend on data
        pulled from the server from the primative types. calculated are values stored from a function thats not just a map.) data_types with
        calculated are run last as they often depend on data pulled from the server from the primative types.
    hide: true
    sortable: (boolean) false
    resizable: (boolean) default should set to true,
    lockVisible: (boolean) default should set to true

    NativeFields: fields are not parsed. taken as is and passed to aggrid directly
        i.e. valueGetter = valueGetterNative
        valueGetterNative: 
        valueSetterNative: (optional) (grid_rules_object). Need to add for date column?
        valueFormatterNative: blah
        toolTipNative: expression for variables


configuration:
    is_server_field: (boolean) this is used by the grid_rules_object to determine if this column should be sent to the server. This is required sense editable
        field can take a function, which makes the information ambiguous if it should be sent to the server.
        if is_editable is default server field along with id?
            editable sends fields by default.
    grid_help:
    
metaFields:
    backup_field:
    validator:
    autocomplete_search_field:
    data_type:
    has_been_modified: bool (default false)

*/

//InitialParams
//ExpressionParser
//ColumnDefs

const meta_field = '__meta_field__'



async function LoadInitialization() {
    //run InitialParams
    //RunColumnDefs for first grid

}
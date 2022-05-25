/*
gridObjects: {
    '__init_params__':  { }
    '__default_values__': { }


    //first grid if main doesnt exists
    //others are subgrid to be called
    'grids': {
        'main': AgGridColumnDef + stuff_configurations (for headers?),
        'xyz': AgGridColumnDef,
    }
}

columDefs:
    headerName: (string) Name of column displayed in aggrid table. If object is empty the value in field is used
    field: (string) column_name stored in each row in row_data. i.e.
        rowData = [ {'field_name': value11, 'field_name2': value12}, {'field_name': value21, 'field_name2': value22} ]
    valueGetter: (grid_rules_object) This is a computed value that displays a value in
        a cell based on a set of calculations. Will also often contain a function to set the value of the cell based on the
        calculated data. The valueGetter function fires everytime a value in a row changes.
    valueSetter: (optional) (grid_rules_object). Need to add for date column?
    valueFormatter: blah
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


configuration:
    is_server_field: (boolean) this is used by the grid_rules_object to determine if this column should be sent to the server. This is required sense editable
        field can take a function, which makes the information ambiguous if it should be sent to the server.
        if is_editable is default server field along with id?
    help:
    
metaFields:
    backup_field:
    validator:
    autocomplete_search_field:
    data_type:
    has_been_modified: bool (default false)

reRoute:
//select route
//insert route
//update route
//delete route
//new row insert rule.
New Row Inputs:
new_row_inputs = {} is an object passed from url page in pages folder. It contains parameters for what to put in each row
    when insert row is selected. Default ke:value pairs are used in place when their is not a value already in place.

*/
// import field_functions from "@/library/app_functions/field_functions"

//InitialParams
//ExpressionParser
//ColumnDefs

class ExpressionParser {
    constructor(json_grid, global_params) {
        this.jg = json_grid
        this.gp = global_params
    }
    CreateErrorFunction() {}
    CreateValueGetterFunction(){}
    CreateFunction() {}
}


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


//import create_automap
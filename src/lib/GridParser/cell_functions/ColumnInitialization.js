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
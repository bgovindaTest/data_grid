/*
This module is used to intialize the modal windows and query data that is created on the client side and
sent to the server side.

InitializeQueryParams: Main function to initialze query params and modal windows. Takes the data_rules, pagination object
    and params object. returns {"pagination": pagination, 'order_by':order_by, 'columnSortNames': columnSortNames, 'where': where, 'modalParams': modalParams }
NextPage: Changes the offest parateter in the pagination object to retrieve next group of server data.
CreateGetRouteParams: This takes the where, pagination, order_by objects and processes them to be sent to the server.

Below is the structure of the main inputs 
where_sort_rules (data_rules), pagination and params example:
var query_rules =[
  {'variable_name': 'date_test','data_describe': "I'm Batmant",'is_sort': true, 
    'is_filter': true, 'filter_active': true, 'filter_show': true, 'data_type': 'date', 'query_type': 'date', 'value': null },
  {'variable_name': 'date_test2','data_describe': "I'm Batmant",
    'is_sort': false, 'is_filter': false, 'filter_active': true, 'filter_show': false, 'data_type': 'date', 'query_type': 'date', 'value': null },
  {'variable_name': 'int_test' ,'is_sort': true,  'is_filter': true,
    'filter_active': true, 'filter_show': false, 'data_type': 'integer', 'query_type': '', 'value': {'value_1':'35.8'} },
  {'variable_name': 'float_test','data_describe': "I'm Batmant",
    'is_sort': true, 'sort_order': 'desc', 'is_filter': true, 'filter_active': true, 
    'filter_show': false, 'data_type': 'float', 'query_type': '', 'value': {'value_2':'35.8'} },
  {'variable_name': 'string_test' ,'is_sort': true, 'is_filter': true, 'filter_active': true,
    'filter_show': false, 'data_type': 'string', 'query_type': '', 'value': 'abc' },
]

var pagination = {'offset': 1, 'limit': 500}
var params = {'permissions': {'filter_active': true, 'allow_update': null, 'allow_delete': 'true', 'is_assigned': 'true'}
var x = qparams.InitializeQueryParams(data_rules, pagination, params )

variable_name: name of variable no spaces.
data_describe: description of data. displayed in filter help and help modal.
is_sort: determins if row should be included in order_by modal
is_filter: determines if row is included in where modal
filter_active: determines if the filter is currently active
filter_show: determines if an active fitler is shown ord hiddent
value: if in row and valid. provides a default value for the filter.
data_type: string, float, integer, boolean, date, autocomplete
query_type: this specifies how the row will pe processed to create the binary sql string component
    string: (in, equals)
    date: (before_on,equals,after_on,between,not_between )
    integer: (in, equals, greater_equal, greater, less, less_equal, between, not_between)
    float: (equals, greater_equal, greater, less, less_equal, between, not_between)
    quick_filter

value: 
    string -> ""
    integer/float: {'value_1': xx, 'value_2': xx, 'value_list': ''}
    date: {'before_date': xx, 'after_date': xx}
    boolean: true/false

permissions: used to determine what data is sent back based on users permissions
  allowUpdate: user can update a row, allowDelete: use can delete the row, isAssigned: row is related to users responsiblities based on the specialty
    heiarchy.
quick_filter: a quick filters. parse string into a list. compares values against all columns. check for simple match.
//permissions and quick_filter are used in query_type to determine the correct module to use. data_type is normally the selector

params: object that allows for default commands to be given to each modal window. Check functions below on what data to send.
    stores custom rules for permissions and quick_filter

columnSortNames: list of column to include in order_by modal

CreateGetRouteParams(where, pagination, order_by):
returns:
where: contains array of the following to be sent to server [{'variable_name': , 'query_type': , 'value':  , 'data_type': ''}].
pagination {'offset':xxx, 'limit':xxx}
order_by [{'variable_name':xx, 'sort_order': asc/desc}] list of columns to order by in the give array order aby by the sort_order field

If any of the values sent to CreateGetRouteParams can not be formated properly its removed from being sent to server.

server/library/query_params.js is the main module the process the data sent from the client and contains comments on the API.
*/
const moment = require('moment')
const gpf    = require("@/library/app_functions/grid_param_functions")
const modal_functions    = require("@/library/app_functions/modal_functions")

//Wrapper function thate creates params object based on user_permissions data object?


// helpActive, data_description: helpActive: false,
const date_query_types   = ["before_on","equals","after_on","between","not_between", "before", "after"]
const number_query_types = ["equals", "greater", "less", "greater_equal", "less_equal", "between","not_between","in"]
const string_query_types = ["equals", "in"]

function InitializeQueryParams(where_sort_rules, pagination_rules, query_routes, user_perms,  params ) {
    /*
    Main Module to create modal windows and initial query parameters.

    where_sort_rules i.e. query_rules
    */
    var columnSortParams = ColumnSortParams(where_sort_rules)
    var order_by  =  columnSortParams['order_by']
    var columnSortNames =  columnSortParams['columnSortNames']
    var modalParams = CreateModalWindowParameters(params, query_routes)

    var where = CreatePermissionsAndQuickFilters(params, user_perms) //also initializes where clause
    AddDataRulesToFilter(where, where_sort_rules)
    var pagination = PaginationInitialization(pagination_rules)
    var output = {"pagination": pagination, 'order_by':order_by, 'columnSortNames': columnSortNames, 'where': where, 'modalParams': modalParams }
    return output
}

function CreateModalWindowParameters(params, query_routes) {
    /* Creates the modalParams that save the state of each modal. i.e. is active. help_active. the params
    object should have the same structure as the modalParams. if a valid value is in the params object it
    will be used to overwrite the default value.
    modalParams = {
        'nameOfModal': params,
        'help_modal': params
    }
    */
    var modalParams = {}
    HelpModalWindowParameters(modalParams,params)
    WhereModalWindowParameters(modalParams,params)
    OrderByModalWindowParameters(modalParams,params)
    PaginationModalWindowParameters(modalParams,params)
    CreateQueryTypeModalParameters(modalParams, params, query_routes)
    InitModalWindowParameters(modalParams,params)
    LoadAndSaveModalWindowParameters(modalParams,params)

    return modalParams
}

function CreateQueryTypeModalParameters(modalParams,params, query_routes) {

    var queryTypeParams = {'route_name': ""}
    if (params.hasOwnProperty('default_query_route')) {
        queryTypeParams['route_name'] = params['default_query_route']
    }
    if (Object.keys(query_routes).length > 0 && queryTypeParams['route_name'] === "") {
        //take first name from route_names
        var route_name = Object.keys(query_routes)[0]
        queryTypeParams['route_name'] = route_name
    }
    //Assemble save_type_description
    for (let key in query_routes) {
        var query_params = query_routes[key]
        var input_params = query_params['input_params']
        if (input_params['__save_route__'] === 'insert') {
            query_params['save_description'] ="Add New Row: Changes to data pulled using this route will be treated as a new entry. A new row will be added to the database on save."
            query_params['save_description'] += " If they row already exists the entry will be rejected. You will need to use an update route type in order to change"
            query_params['save_description'] +="an existing row."
        } else if (input_params['__save_route__'] === 'update') {
            query_params['save_description'] ="Update Existing Row: Changes to data pulled using this route will attempt to modify the existing row in the databse."
        } else if (input_params['__save_route__'] === 'upsert') {
            query_params['save_description'] ="Create Row or overwrite exiting row. Changes to data pulled using this route will be treated as a new entry. A new row will be added to the database on save."
            query_params['save_description'] += " If they row already exists the entry will attempt to overwrite it."
        } else {
            query_params['save_description'] ="Unique operation contact admin for details"
        }
    }

    modalParams['querytype_modal'] = queryTypeParams

}



function HelpModalWindowParameters(modalParams,params) {

    var helpParams = {'help_msg': ""}

    if (params.hasOwnProperty('help_modal')) {
        if (params['help_modal'].hasOwnProperty('help_msg')) {
            helpParams['help_msg'] = params['help_modal']['help_msg']
        }
    }
    modalParams['help_modal'] = helpParams
}
function WhereModalWindowParameters(modalParams,params) {
    //help_active is help window displayed. select_column is select column module in where module active
    var whereParams = {'help_active': false, 'select_column': false}
    modalParams['where_modal'] = whereParams
}
function OrderByModalWindowParameters(modalParams,params) {
    var orderbyParams = {'help_active': false}
    modalParams['order_by_modal'] = orderbyParams
}
function PaginationModalWindowParameters(modalParams,params) {
    var orderbyParams = {'help_active': false}
    modalParams['page_modal'] = orderbyParams   
}
function InitModalWindowParameters(modalParams,params) {}

function LoadAndSaveModalWindowParameters(modalParams,params) {
    //help_active is help window displayed. select_column is select column module in where module active
    modalParams['save_modal'] = modal_functions.SavingModalParamsInitialization()
    modalParams['load_modal'] = modal_functions.LoadingModalParamsInitialization()
    if (params.hasOwnProperty('default_query_route')) {
        modalParams['load_modal']['route_name'] = params['default_query_route']
    }

}


//Create Initial Paramters for pagination
function PaginationInitialization(pagination_rules) {
    var pagination = {}
    if (pagination_rules.hasOwnProperty('offset')) {
        pagination['offset'] = parseInt(pagination_rules['offset'])
        if (isNaN(pagination['offset'])) {
            pagination['offset'] = 0
        } else { if (pagination['offset'] < 0) { pagination['offset'] = 0 } }

    } else { pagination['offset'] = 0 }

    if (pagination_rules.hasOwnProperty('limit')) {
        pagination['limit'] = parseInt(pagination_rules['limit'])
        if (isNaN(pagination['limit'])) {
            pagination['limit'] = 1000
        } else { 
            if (pagination['limit'] < 10) { pagination['limit'] = 10 } 
            else if ( pagination['limit'] > 5000 ) { pagination['limit'] = 5000 } 
        }
    } else { pagination['limit'] = 1000 }

    return pagination
}

function ColumnSortParams(where_sort_rules) {
    /*
    This function takes the where_sort_rules object and creates two objects used to determine what
    columns can be sorted from the server data and an object to store the rules for the sort passed. The variable_name
    is added to columnSortNames if the where_sort_rules as is_sort: true. if it has a sort_order: asc/desc as a default value
    its added to the order_by object as a default 

    returns:
        columnSortNames: List of all columns that a user can sort by
        order_by: [{'variable_name': , 'sort_order':}] a json list that contains what columns should be sorted
            in what order and how.
    */
    var i
    var columnSortNames = []
    var sort_rules = []
    for (i=0; i< where_sort_rules.length; i++) {
        var variable_name = where_sort_rules[i].variable_name
        if (! where_sort_rules[i].hasOwnProperty('is_sort') ) {continue}
        var is_sort = where_sort_rules[i].is_sort
        if (!is_sort) {continue}
        if (!columnSortNames.includes(variable_name) ) { 
            columnSortNames.push(variable_name) 
            if (where_sort_rules[i].hasOwnProperty('sort_order') ) {
                var sort_order = where_sort_rules[i].sort_order
                if ( ['asc', 'desc'].includes(sort_order.toLowerCase()) ) {
                    sort_rules.push({'variable_name': variable_name, 'sort_order': sort_order})
                } else { sort_rules.push({'variable_name': variable_name, 'sort_order': 'desc'}) }
            }
        }
    }
    var output = {}
    output['columnSortNames'] = columnSortNames
    output['order_by'] = sort_rules
    return output
}
//used for permissions and quick_filter
//if empty used defautl values. else user can define default filters?
function CreatePermissionsAndQuickFilters(params, user_perms) {
    /*
    function CreateQuickFilter(){}
    function CreatePermissionsFilter() {}
    used for permissions and quick_filter
    if empty used defautl values. else user can define default filters?
    permissions and quick_filter
    'filter_active': determines if filter is active or not?
    'filter_show': if active is the filter displayed or hidden. 
    'exclude_filter':
    */

    //filter values is true, false null
    var value_types = ['false', 'true', 'null']
    var pn = 'permissions'
    var qf = 'quick_filter'
    var where = []
    var p_row ={'variable_name': pn,'help_active': false, 'data_describe': "",
        'filter_active': false, 'filter_show': true,  'is_assigned_filter': false,
        'query_type': "", 'data_type': 'permissions', "value": 
        {'allow_update':'null', 'allow_delete': 'null', 'is_assigned': 'null'}  }

    //update p_row based on user permissions
    //is_assigned_filter?
    //If read only and has permissions determine how to set permissions
    //user init function?
    if (params.hasOwnProperty(pn) ) {
        if (params[pn].hasOwnProperty('init_function') ) {
            params[pn]['init_function'](p_row, user_perms)
        } else {
            if (gpf.IsAdmin(user_perms)) {
                p_row['filter_active'] = true
                p_row['filter_show'] = true
                p_row['value']['allow_update'] = 'true'
            } else if (gpf.CanUpdate(user_perms) ) {
                p_row['filter_active'] = true
                p_row['filter_show'] = true
                p_row['value']['allow_update'] = 'true'
            } else if (gpf.CanDelete(user_perms) ) {
                p_row['filter_active'] = true
                p_row['filter_show'] = true
                p_row['value']['allow_delete'] = 'true'
            } else if (gpf.IsAssigned(user_perms) ) {
                if (params[pn].hasOwnProperty('is_assigned_filter') ) {
                    if (params[pn]['is_assigned_filter']) {
                        p_row['filter_active'] = true
                        p_row['filter_show'] = true
                        p_row['value']['is_assigned'] = 'true'

                    }
                }
            }
        }
    } else {
        p_row['filter_active'] = true
        if (gpf.IsAdmin(user_perms)) {
            p_row['filter_active'] = true
            p_row['filter_show'] = true
            p_row['value']['allow_update'] = 'true'
        } else if (gpf.CanUpdate(user_perms) ) {
            p_row['filter_active'] = true
            p_row['filter_show'] = true
            p_row['value']['allow_update'] = 'true'
        } else if (gpf.CanDelete(user_perms) ) {
            p_row['filter_active'] = true
            p_row['filter_show'] = true
            p_row['value']['allow_delete'] = 'true'
        } 

    }


    //quick_filter
    var qf_row = {'variable_name': qf,'help_active': false, 'data_describe': "",
        'filter_active': true, 'filter_show': true, 'query_type': "", 'data_type': 'quick_filter', "value": "" }

    if (params.hasOwnProperty(qf) ) {
        var qx = params[qf]
        if (qx.hasOwnProperty('filter_active')) { qf_row['filter_active'] = qx['filter_active'] }
        if (qx.hasOwnProperty('data_describe')) { qf_row['data_describe'] = qx['data_describe'] }
        if (qx.hasOwnProperty('filter_show')) { qf_row['filter_show'] = qx['filter_show'] }
        if (qx.hasOwnProperty('value'))  { qf_row['value']  = qx['value'] }
        if (qx.hasOwnProperty('exclude_filter')) {  if (! qx['exclude_filter']) {where.push(qf_row)} } else {where.push(qf_row)} 
    } else { where.push(qf_row) }


    //permissions. need an init function
    if (params.hasOwnProperty(pn) ) {
        var px = params[pn]
        // is_assigned_filter if not is_assigned must be null.
        if(px.hasOwnProperty('is_assigned_filter')) { p_row['is_assigned_filter'] = px['is_assigned_filter']}

        if (px.hasOwnProperty('filter_active')) { p_row['filter_active'] = px['filter_active'] }
        if (px.hasOwnProperty('data_describe')) { p_row['data_describe'] = px['data_describe'] }
        if (px.hasOwnProperty('filter_show')) { p_row['filter_show'] = px['filter_show'] }
        if (px.hasOwnProperty('allow_update')) { p_row['value']['allow_update']   = px['allow_update'] }
        if (px.hasOwnProperty('allow_delete')) { p_row['value']['allow_delete']   = px['allow_delete'] }
        if (px['is_assigned_filter']) { 
            if (px.hasOwnProperty('is_assigned')) {p_row['value']['is_assigned'] = px['is_assigned']} 
        
        }
        if (!value_types.includes(p_row['value']['allow_update'])) {
            if ( (!value_types.includes(String( p_row['value']['allow_update'] ))) ) {
                p_row['value']['allow_update'] = 'false'
            } else {  p_row['value']['allow_update'] = String( p_row['value']['allow_update'] ) }
        }
    
        if (!value_types.includes(p_row['value']['allow_delete'])) {
            if ( (!value_types.includes(String( p_row['value']['allow_delete'] ))) ) {
                p_row['value']['allow_delete'] = 'false'
            } else {  p_row['value']['allow_delete'] = String( p_row['value']['allow_delete'] ) }
        }
    
        if (!value_types.includes(p_row['value']['is_assigned'])) {
            if ( (!value_types.includes(String( p_row['value']['is_assigned'] ))) ) {
                p_row['value']['is_assigned'] = 'null'
            } else {  p_row['value']['is_assigned'] = String( p_row['value']['is_assigned'] ) }
        }
        if (px.hasOwnProperty('exclude_filter')) {  if (! px['exclude_filter']) {where.push(p_row)}  } else {where.push(p_row)}
    } else { where.push(p_row)  }



    return where

}

function AddDataRulesToFilter(where, where_sort_rules) {
    /*
    This is the main module to add columns to the where modal. It creates different rules based on the data type of the variable.
    Valid data_types are integer, float, date, string and boolean.
    */
    for (var i=0; i < where_sort_rules.length; i++) {
        var fx = where_sort_rules[i]
        if (! fx.hasOwnProperty('variable_name') ) {continue}
        if (! fx.hasOwnProperty('is_filter') ) {continue}
        if (! fx['is_filter'] ) {continue}
        if (! fx.hasOwnProperty('data_type') ) {continue}
        var dx = fx['data_type']
        var filter_row = { 'variable_name': fx['variable_name'], 'filter_active': false, 'filter_show': true, 'data_describe': "", 'help_active': false }
        if (fx.hasOwnProperty('data_describe')) { filter_row['data_describe'] = fx['data_describe'] }        
        if (fx.hasOwnProperty('filter_active')) { filter_row['filter_active'] = fx['filter_active'] }
        if (fx.hasOwnProperty('filter_show')) { filter_row['filter_show'] = fx['filter_show'] }
        if (dx === "integer") {
            NumberValue(filter_row, fx, "integer")
            // console.log(filter_row)
            where.push(filter_row)
        } else if (dx === "float") {
            NumberValue(filter_row, fx, "float")
            where.push(filter_row)
        } else if (dx === "date") {
            DateValue(filter_row, fx)
            where.push(filter_row)
        } else if (dx === "string") {
            StringValue(filter_row, fx)
            where.push(filter_row)
        } else if (dx === "boolean") {
            BooleanValue(filter_row, fx)
            where.push(filter_row)
        }
    }



}



/*
DateValue, NumberValue, StringValue and BooleanValue are called by AddDataRulesToFilter. They are used to create the filter
rules object for each specified data type.

*/
//check if date valid? else null
function DateValue(filter_row, data_row) {
    //verify if default date is valid date
    var queryTypeList = ["before_on","equals","after_on","between","not_between"]
    var date_val = {'before_date': null, 'after_date': null}
    filter_row['data_type']  = 'date'
    filter_row['query_type'] = ""
    var date_formats = ['YYYY-MM-DD','YYYY-M-DD','YYYY-MM-D','YYYY-M-D', 'MM/DD/YYYY','M/DD/YYYY','MM/D/YYYY','M/D/YYYY']
    filter_row['value'] = date_val

    if (! data_row.hasOwnProperty('value') ) {return }
    var vx = data_row['value']
    if (vx === null) {return}
    if (typeof vx !== 'object') {return}

    if (vx.hasOwnProperty('after_date') ) {
        var afd = vx['after_date']
        var moment_date = moment(afd, date_formats, true)
        if (moment_date.isValid()) {
            date_val['after_date'] = moment_date.format('MM/DD/YYY')
        }
    }
    if (vx.hasOwnProperty('before_date') ) {
        var afd = vx['before_date']
        var moment_date = moment(afd, date_formats, true)
        if (moment_date.isValid()) {
            date_val['before_date'] = moment_date.format('MM/DD/YYY')
        }
    }
    if (data_row.hasOwnProperty('query_type') ) {
        if (queryTypeList.includes(data_row['query_type']) ) {
            filter_row['query_type'] = data_row['query_type']
        }  
    }

}

//check if object value exists. if not string set default ""
function StringValue(filter_row, data_row) {
    var queryTypeList = ["equals","in","not_in"]
    filter_row['data_type']  = "string"
    filter_row['query_type'] = ""
    filter_row['isComma'] = false

    if (data_row.hasOwnProperty('query_type') ) {
        if (queryTypeList.includes(data_row['query_type']) ) { 
            filter_row['query_type'] = data_row['query_type']
        }  
    }

    if (! data_row.hasOwnProperty('value') ) {
        filter_row['value'] = ""
        return
    } else {
        filter_row['value'] = String(data_row['value'])
    }
}

//check if object value exists.
function BooleanValue(filter_row, data_row) {
    filter_row['data_type']  = "boolean"
    filter_row['query_type'] = "boolean"
    filter_row['value'] = false

    if (data_row.hasOwnProperty('value') ) {
        if (typeof data_row['value'] === "boolean") {
            filter_row['value'] = data_row['value']
        }
    }
}

function NumberValue(filter_row, data_row, data_type) {
    var queryTypeList = ["equals", "greater", "less", "greater_equal", "less_equal", "between","not_between","in"]

    var number_val = {'value_1': null, 'value_2': null, 'value_list': ""}
    // if (data_type === "integer") { number_val['value_list'] = "" }
    if (!['integer', 'float'].includes(data_type)) {data_type = "float"}
    filter_row['value'] = number_val


    filter_row['data_type']  = data_type
    filter_row['query_type'] = ""
    if (! data_row.hasOwnProperty('value') ) {
        filter_row['value'] = number_val
        return
    }
    var vx = data_row['value']
    if (vx === null || typeof vx !== 'object') { return }

    if (vx.hasOwnProperty('value_1') ) {
        var vy = TypeCastNumber(vx['value_1'], data_type)
        filter_row['value']['value_1'] = vy
    }
    if (vx.hasOwnProperty('value_2') ) {
        var vy = TypeCastNumber(vx['value_2'], data_type)
        filter_row['value']['value_2'] = vy
    }
    if (vx.hasOwnProperty('value_list') && data_type === "integer" ) {
        filter_row['value']['value_list'] = String(vx['value_list'])
    }

    if (data_row.hasOwnProperty('query_type') ) {
        if (queryTypeList.includes(data_row['query_type']) ) {
            if ( data_row['query_type'] = "in"  ) {
                if (data_type==="integer") {filter_row['query_type'] = data_row['query_type']}
            } else { filter_row['query_type'] = data_row['query_type'] }
        }  
    }

}

/*
TypeCast functions converts values to proper format. If cant be converetd values will be ignored.
*/

function TypeCastValues(variable_values, variable_type) {
    /*
    This make sure the variable type is correct. Does type conversion to a single value
    or an array of values
    variable_value: this is the value to be modified. Can be a single value or an array of values.
    variable_type: The required type of the value. Can be //integer, float, date, string

    if value cant be converted return null. or an empty list. Skip addition to array
    if empty list?
    */
    if (variable_type == 'integer') {
        if (Array.isArray(variable_values)) {
            let mixedArray = variable_values.map(el=>parseInt(el))
            let integerArray = mixedArray.filter( (value) => !isNaN(value) )
            return integerArray
        } else {
            return parseInt(variable_values)
        }

    } else if (variable_type == 'float') {
        if (Array.isArray(variable_values)) {
            let mixedArray = variable_values.map(el=>parseFloat(el))
            let floatArray = mixedArray.filter( (value) => !isNaN(value) )
            return floatArray
        } else {
            return parseFloat(variable_values)
        }

    } else if (variable_type == 'string') {
        if (Array.isArray(variable_values)) {
            let stringArray = variable_values.map(el=> String(el))
            return stringArray
        } else {
            return String(variable_values)
        }

    } else if (variable_type == 'date') {
        //only checks for single value. No array conversion
        var date_formats = ['YYYY-MM-DD','YYYY-M-DD','YYYY-MM-D','YYYY-M-D', 'MM/DD/YYYY','M/DD/YYYY','MM/D/YYYY','M/D/YYYY']
        var moment_date = moment(variable_values, date_formats, true)
        if (moment_date.isValid()) {
            return moment_date.format('YYYY-MM-DD')
        } else {
            return null
        }
    }
}

function TypeCastDate(date_val, format_string) {
    var date_formats = ['YYYY-MM-DD','YYYY-M-DD','YYYY-MM-D','YYYY-M-D', 'MM/DD/YYYY','M/DD/YYYY','MM/D/YYYY','M/D/YYYY']
    var moment_date = moment(date_val, date_formats, true)
    if (moment_date.isValid()) {
        return moment_date.format(format_string)
    } else {
        return null
    }
}

function TypeCastNumber(num_val, data_type) {
    if (data_type === "integer") {
        num_val = parseInt(num_val)
        if (isNaN(num_val)) {return null}
        else { return num_val }
    }
    if (data_type === "float") {
        num_val = parseFloat(num_val)
        if (isNaN(num_val)) {return null}
        else { return num_val }
    }
    return null
}


function TypeCastPermissionsBoolean(bool_str) {
    if (bool_str === 'true')  {return true}
    if (bool_str === 'false') {return false}
    if (bool_str === 'null')  {return null}
    return null

}


/*
CreateGetRouteParams takes the objects generated by the modal windows, parses them and preprocess the data type. If all values
are valid its included in the final object. Else its excluded from the final object sent to the server.
*/
function CreateGetRouteParams(queryParams) {
    /*
    Pulls data rules and intializes paramters. queryParams is an object that contains the current values
    from all the modal windows.
    req_body from client has the following structure
    req.body['rules'] = [{}] //rules contain informations such as include read only.
    req.body['where'] = [{}]
    req.body['order_by'] = [{}]
    req.body['pagination'] = {}
    */
    var req_body = {'where': [], 'order_by': [], 'pagination': {}, 'rules': [{}] }
    var where = queryParams['where']
    var order_by = queryParams['order_by']
    var pagination = queryParams['pagination']
    ParseWhereObject(req_body, where)
    ParseOrderBy(req_body, order_by)
    ParsePagination(req_body, pagination)
    return req_body
}

function ParsePagination(req_body, pagination) {
    var lx = parseInt(pagination['limit'])
    var offset = parseInt(pagination['offset'])
    if (isNaN(lx) ) {lx = 1000} else if (lx < 10 ) {lx = 10} else if (lx > 5000) {lx = 5000}
    if (isNaN(offset) ) {offset = 0} else if (offset < 0 ) {offset = 0}
    var pgx = req_body['pagination']
    pgx['limit']  = lx
    pgx['offset'] = offset
}

function ParseOrderBy(req_body, order_by) {
    //if column name is empty or sort_by is empty continue
    var order_by_list = req_body['order_by']
    for (var i =0; i < order_by.length; i++) {
        var ox = order_by[i]
        var cn = ox['variable_name'].trim()
        var sb = ox['sort_order'].toUpperCase()
        if (['ASC', 'DESC'].includes(sb) && cn !== "" ) {
            order_by_list.push({'variable_name': cn, 'sort_order': sb})
        }
    }
}


function ParseWhereObject(req_body, where_list) {
    /*
    where_list: contains the where statemenents generated by the modal windows where, order_by and pagination
    where_list_out: container object for req_body. contains processed where statements to send to the server
    */
    var where_list_out = req_body['where']
    for(var i =0; i< where_list.length; i++) {
        var where_statement = where_list[i]
        var filter_active = where_statement['filter_active']
        if (!filter_active) {continue }
        var dt = where_statement['data_type']
        if (dt === 'permissions') {
            QueryPermissionsParse (where_list_out, where_statement)
        } else if (dt === 'quick_filter') {
            QueryQuickFilterParse (where_list_out, where_statement)
        } else if (dt === 'integer') {
            QueryNumberParse (where_list_out, where_statement, dt)
        } else if (dt === 'float') {
            QueryNumberParse (where_list_out, where_statement, dt)
        } else if (dt === 'string') {
            QueryStringParse (where_list_out, where_statement)
        } else if (dt === 'boolean') {
            QueryBooleanParse (where_list_out, where_statement, dt)
        } else if (dt === 'date') {
            QueryDateParse (where_list_out, where_statement)
        }
    }
}

function QueryPermissionsParse (where_list, where_statement) {
    /*
    Process permissions object and converts into to a series of boolean statements.
    the column names have a special process for filtering data on the server side.
    */

    ['allow_update', 'allow_delete', 'is_assigned'].forEach( (permx) => {
        var vx = TypeCastPermissionsBoolean(where_statement['value'][permx])
        if (vx !== null) {
            var wx = {'variable_name': permx, 'query_type': "boolean", 'data_type': "boolean", "value": vx}
            where_list.push(wx)
        }
    })

}
function QueryQuickFilterParse (where_list, where_statement) {
    var value = String(where_statement['value'])
    var value_list = ""
    // var query_type = where_statement['query_type']
    var wx
    value_list = String(value).split(/(\s+)/).filter(e => e.trim().length > 0 )
    value_list = TypeCastValues(value_list, 'string')
    if (value_list.length === 0) { return }
    value = value_list
    wx = {'variable_name': "quick_filter",'data_type': 'string' , 'query_type':  "quick_filter" ,'value': value }
    where_list.push(wx)
}

function QueryNumberParse (where_list, where_statement, data_type) {
    //parses where_statement that has data_type integer || float.
    var value_1 = TypeCastNumber(where_statement['value']['value_1'], data_type)
    var value_2 = TypeCastNumber(where_statement['value']['value_2'], data_type)
    var variable_name = where_statement['variable_name']
    var value_list_tmp = []
    var qx = ""
    var wx  = {'variable_name': variable_name,'data_type': data_type , 'query_type': qx ,'value':
    {'value_1': value_1, 'value_2': value_2, 'value_list': value_list_tmp} }

    if (!['integer','float'].includes(data_type)) {return }
    if (data_type === "integer" && where_statement['query_type'] === "in") {
        var value_list = where_statement['value']['value_list']
        value_list = String(value_list).split(/[\n\s,]+/).filter(e => e.trim().length > 0 && e.trim() !== ',' ).map(function(item) { return item.trim(); })
        value_list = TypeCastValues(value_list, data_type)
        // console.log(value_list)
        wx['query_type'] = where_statement['query_type']
        wx['value']['value_list'] = value_list
        if (value_list.length === 0) { return }
        where_list.push(wx)
        return
    }

    if (value_1 === null && value_2 === null ) { return }

    if ( ["equals", "greater", "less", "greater_equal", "less_equal"].includes(where_statement['query_type']) ) {
        if (value_1 === null || isNaN(value_1) ) { return }
        wx['query_type'] = where_statement['query_type']
        where_list.push(wx)
        return
    }
    
    if ( ["between","not_between"].includes(where_statement['query_type']) ) {
        if (value_1 === null || value_2 === null || isNaN(value_1) || isNaN(value_2) ) { return }
        wx['query_type'] = where_statement['query_type']
        where_list.push(wx)
        return
    }
}

function QueryDateParse (where_list, where_statement) {
    var after_date = TypeCastDate(where_statement['value']['after_date'], 'YYYY-MM-DD')
    var before_date = TypeCastDate(where_statement['value']['before_date'], 'YYYY-MM-DD')
    if (after_date === null && before_date === null ) { return }
    var variable_name = where_statement['variable_name']
    var wx = {'variable_name': variable_name,'data_type': 'date' , 'query_type': "" ,'value': {'before_date': before_date, 'after_date': after_date}  }
    if (! where_statement.hasOwnProperty('query_type')) { return} 
    else if (! date_query_types.includes(where_statement['query_type'] ) ) { return }

    wx['query_type'] = where_statement['query_type']

    if(["before_on","equals","before"].includes(wx['query_type']) ) {
        if (before_date === null) { return }
        where_list.push(wx)
        return
    }
    if( "after_on" === wx['query_type'] || "after" === wx['query_type'] ) {
        if (after_date === null) { return }
        where_list.push(wx)
        return
    }
    if(["between","not_between"].includes(wx['query_type']) ) {
        if (before_date === null || after_date === null ) { return }
        where_list.push(wx)
        return
    }
}
function QueryStringParse (where_list, where_statement) {
    //is comma delimited? strip white space? trim?
    //if in send list
    //else send string
    var value = String(where_statement['value'])
    var value_list = []
    var query_type = where_statement['query_type']
    var variable_name = where_statement['variable_name']
    var wx
    if (!['in','equals','not_in'].includes(query_type)) {return }

    if (where_statement['query_type'] === "in" || where_statement['query_type'] === "not_in" ) {
        if (where_statement['isComma']) {
            value_list = String(value).split(',').filter(e => e.trim().length > 0 && e.trim() !== "," ).map(function(item) { return item.trim(); })
            value_list = TypeCastValues(value_list, "string")
        } else {
            value_list = String(value).split(/[\n\s]+/).filter(e => e.trim().length > 0 )
            value_list = TypeCastValues(value_list, "string")
        }
        if (value_list.length === 0) { return }
        value = value_list
        wx = {'variable_name': variable_name,'data_type': 'string' , 'query_type': query_type ,'value': value }
        where_list.push(wx)
        return
    } else if (where_statement['query_type'] === "equals") {
        wx = {'variable_name': variable_name,'data_type': 'string' , 'query_type': query_type ,'value': value }
        where_list.push(wx)
        return
    }


}

function QueryBooleanParse (where_list, where_statement) {

    var vx = where_statement['value']
    var variable_name = where_statement['variable_name']
    if (typeof vx !== 'boolean') {return}

    wx = {'variable_name': variable_name,'data_type': 'boolean' , 'query_type': 'boolean' ,'value': vx }
    where_list.push(wx)

}


function NextPage(pagination ) {
    var lx =parseInt(pagination['limit'] )
    var offset = parseInt(pagination['offset'] )
    pagination['offset'] = lx + offset
}

module.exports = {
    "InitializeQueryParams": InitializeQueryParams,
    "CreateGetRouteParams": CreateGetRouteParams,
    "NextPage": NextPage
}
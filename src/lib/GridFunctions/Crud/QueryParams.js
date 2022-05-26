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

var wx = {'variable_name': permx, 'query_type': "boolean", 'data_type': "boolean", "value": vx}

server/library/query_params.js is the main module the process the data sent from the client and contains comments on the API.
*/

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

module.exports = {
    "InitializeQueryParams": InitializeQueryParams,
    "CreateGetRouteParams": CreateGetRouteParams,
    "NextPage": NextPage
}
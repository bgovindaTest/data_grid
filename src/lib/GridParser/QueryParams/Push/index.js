/*
Main functions for processing crud events and sending data back and forth
between UI and server.

Creates rowData from server row


Process and store OrderBy and FilterParams

ui_fileds

{'column_name': 'col_name_3', 'operator': '!=', 'value':  'a', 'value2': null, delimiterType: null, dataType: null },

//value2 used for between and not_between
//otherwise eveything stored in value

let where_statements = [
    {'column_name': 'col_name_1', 'operator': '=', 'value':  1 },
    {'column_name': 'col_name_2', 'operator': 'is_null', 'value':  "" },
    {'column_name': 'col_name_3', 'operator': '!=', 'value':  'a' },
]

*/


const data_types = require ('../../DataConfig')
const type_check = require('../../TypeCheck')

function CreateFilterObject() {
    let x = {'current': [], 'new': []}
    //add default filters to current and new
    return x
}

function CreateOrderByObject() {
    let x = {'current': [], 'new': []}
    //add default filters to current and new
    return x
}

function NewQueryReset(filterParams, orderByParams, pageParams ) {
    //resets query params.
    ftmp = filterParams['new']
    otmp = orderByParams['new']
    filterParams['current'] = ftmp
    filterParams['new'] = []
    orderByParams['current'] = otmp
    orderByParams['new'] = []
    newPage = PageInit()
    let keys = Object.keys(newPage)
    for(let i = 0; i < keys.length; i++) {pageParams[keys[i]] =newPage[keys[i]] }
}





function PageInit() {
    let page_size = data_types.page_size
    let limit  = page_size
    return {'limit': limit, 'offset': 0, 'page_index': 0, 'page_size': page_size }
}


function ChangePage(i, page_params) {
    let page_index = page_params['page_index']
    if(type_check.IsInteger(i) ) {
        page_index = parseInt(page_index)
    } 
    
    
    
    else {page_index = 0 }

    if (page_index < 0) { page_index = 0 }
    let page_size = page_params['page_size']
    page_params['limit']  = (1+page_index)*page_size
    page_params['offset'] = page_index*page_size
}
function PreviousPage() {  ChangePage(-1, page_params )}
function NextPage(page_params) { ChangePage(1, page_params ) }
function ResetPagination() {}



function DefaultFilterInit(column_name, header_name, data_type) {

    let def_operator = data_types.DefaultOperator(data_type_name)
    let init_filter = {'column_name': column_name, 'operator': def_operator, 'value':  null, 
        'value2': null, 'delimiterType': null, 'dataType': data_type,
        'headerName': header_name }
    return init_filter
}

function DefaultOrderByInit(column_name, header_name) {
    let init_order = {'column_name': column_name, 'order_by': 'asc', 'headerName': header_name}
    return init_order
}


function RemoveFilter(  filter_array, index )  { RemoveItemFromArray( filter_array, index) }
function RemoveOrderBy( orderby_array, index ) { RemoveItemFromArray( orderby_array, index)}

function RemoveItemFromArray( array, index ) {
    if (index > -1) { array.splice(index, 1) }
}

function ClearFilters(filter_array)  { filter_array.length = 0 }
function ClearOrderBy(orderby_array) { orderby_array.length = 0 }

function DelimiterType (delimiter_type) {
    if (data_type.delimiter_typeName.hasOwnProperty(delimiter_type)) {
        let dname = data_type.delimiter_typeName['']
    }

    defaultDelimiter
    delimiter_typeName

} //how to split and return value


function FilterCrudCreate ( filterParams ) {
    let current_params = filterParams['current_params']
}

function OrderByCrudCreate (orderbyParams) {

}



function IgnoreInvalidFilter () {}

function ServerRowToUiRow() {
    //creates row_data object,
    //parsed dot assembly?
    //returns


    //if lookup create object and join by dot operator

}


//crud_fields
//ignore primary_key

function InsertCrud(rowData, ) {}
function DeleteCrud() {}
function UpdateCrud() {}
function AssemblyModifyStatements( crudParamsObject) {

    //upsert or onconflict
    //set or data?
    //pk
    //takes all insert, update and delete statements
    //and creates final object for batch statements.
}

function ProcessModifyErrorStatements() {}


function CreateGetRouteParams(selectUrl, filterParams, orderByParams, pageParams ) {
    /*
    Pulls data rules and intializes paramters. queryParams is an object that contains the current values
    from all the modal windows.
    req_body from client has the following structure
    req.body['rules'] = [{}] //rules contain informations such as include read only.
    req.body['where'] = [{}]
    req.body['order_by'] = [{}]
    req.body['pagination'] = {}
    */
    var req_body = {'where': [], 'order_by': [], 'pagination': {}}
    var where = queryParams['where']
    var order_by = queryParams['order_by']
    var pagination = queryParams['pagination']
    this.ParseWhereObject(req_body, where)
    this.ParseOrderBy(req_body, order_by)
    this.ParsePagination(req_body, pagination)
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

// //Create Initial Paramters for pagination
let pagination = {'limit': 5, 'offset': 0}

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
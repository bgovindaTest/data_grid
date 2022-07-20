/*
This module is responsible for creating and maintaining the parameters required for 
pulling data into the main grid.

Filters
OrderBy
Pagination
Get Route parameter assembly.

The async request is made in another module


UI object for filter. value2 is for between and not_between
{'column_name': 'col_name_3', 'operator': '!=', 'value':  'a', 'value2': null, delimiterType: null, dataType: null },

let query_params = [
    Array of objects. Contains information for crud operations.
    Operation order is not preserved.
    {
        "crud_type": "", //only needed for save route 
        "data": "", //array of objects: [{x:"valx1", y:"valy1"},{x:"valx2", y:"valy2"}]
        "default_fields": "", //object with default type {x:"default_value_x", y:"default_value_y"}
        "set_fields": "",  //array that has columns that should be used for set on upsert
        "on_conflict": "", //string a-zA-Z0-9
        "on_constraint": "", //string a-zA-Z0-9
        "where": "", //array of objects: [{x:"valx1", y:"valy1"},{x:"valx2", y:"valy2"}]
        "offset": "", //should be integer greater or equal to 0
        "limit": "", //should be positive integer
        "search_filter": "", //string or object with quick filter type:
        "search_rank": "", //bool
        "returning": "", //array of fields to used for returning [id, column_1, xxx] //defaults to id?
        "order_by": ""  // [{'col1': 'asc}, {'col_2': 'desc'}] 
        }
    ]


//value2 used for between and not_between
//otherwise eveything stored in value

let order_by = { 'column_name': xyz, 'order_by': 'asc }

let where_statements = [
    {'column_name': 'col_name_1', 'operator': '=', 'value':  1 },
    {'column_name': 'col_name_2', 'operator': 'is_null', 'value':  "" },
    {'column_name': 'col_name_3', 'operator': '!=', 'value':  'a' },
]

*/


const data_config  = require ('../../../DataConfig')
const type_check   = require('../../../TypeCheck')
const chmodFunc    = require('../../../lib/chmodFunc')

class Pull {
    /*
        filterParams, orderByParams and pageParams is initialized
        by GridParser/index.js
    */
    constructor (grid, filterParams, orderByParams, pageParams) {
        this.columnDefs    = grid
        this.filterParams  = filterParams
        this.orderByParams = orderByParams
        this.PageParams    = pageParams
        this.pullFields    = []
    }

    PullParamsInit( ) {
        let columnDefs = this.columnDefs
        for (let i =0; i < columnDefs.length; i++ ) {
            let grid_column = columnDefs[i]
            let field       = grid_column['field']
            if (! chmodFunc.IsPull( grid_column['chmodParams']  ) ) {continue}
            this.pullFields.push(field)
        }
    }


    //create parameters for query
    NewQueryParams() {
        this.NewQuerySet( )
        let urlParams = this.GetRouteParams()
        return urlParams
    }


    PreviousPageParams() {  
        this.ChangePage(-1)
        let urlParams = this.GetRouteParams()
        return urlParams
    }
    NextPageParams() { 
        this.ChangePage( 1 ) 
        let urlParams = this.GetRouteParams( )
        return urlParams
    }



    NewQuerySet() {
        //resets query params.
        ftmp = this.filterParams['new']
        otmp = this.orderByParams['new']
        this.filterParams['current'] = ftmp
        this.filterParams['new'] = []
        this.orderByParams['current'] = otmp
        this.orderByParams['new'] = []
        newPage = PageInit()
        let keys = Object.keys(newPage)
        for(let i = 0; i < keys.length; i++) {this.pageParams[keys[i]] =newPage[keys[i]] }
    }


    //pagination functions
    ChangePage(i) {
        let page_params = this.PageParams
        let page_index  = page_params['page_index']
        if(type_check.IsInteger(i) ) {
            page_index = page_index + parseInt(i)
        } else {page_index = 0 }

        if (page_index < 0) { page_index = 0 }
        let page_size = page_params['page_size']
        page_params['limit']  = (1+page_index)*page_size
        page_params['offset'] = page_index*page_size
    }

    GetRouteParams(filterParams, orderByParams, pageParams ) {
        /*
        Pulls data rules and intializes paramters. queryParams is an object that contains the current values
        from all the modal windows.
        req_body from client has the following structure
        req.body['where'] = [{}]
        req.body['order_by'] = [{}]
        req.body['pagination'] = {}
        */
        let req_body = {}
        req_body['where']      = WhereObject()
        req_body['order_by']   = this.OrderByObject()
        let pgx                = this.PaginationObject()
        req_body['limit']      = pgx['limit'] 
        req_body['offset']     = pgx['offset'] 
        return req_body
    }

    OrderByObject() {
        //if column name is empty or sort_by is empty continue
        let order_by = this.orderByParams['current']
        let order_by_list = []
        for (let i =0; i < order_by.length; i++) {
            let ox = order_by[i]
            let cn = ox['column_name']
            let sb = ox['order_by'].toLowerCase()
            if (['asc', 'desc'].includes(sb) && cn !== "" ) {
                order_by_list.push({'column_name': cn, 'order_by': sb})
            }
        }
        return order_by_list
    }
    PaginationObject() {
        let pagination = this.pageParams
        var lx = parseInt(pagination['limit'])
        var offset = parseInt(pagination['offset'])
        if (isNaN(lx) ) {lx = data_config.page_size}
        if (lx < 0) {lx = data_config.page_size}
        if (isNaN(offset) ) {offset = 0}
        if (offset < 0 ) {offset = 0}
        var pgx = {}
        pgx['limit']  = String(lx)
        pgx['offset'] = String(offset)
        return pgx
    }

    ToRowData(queryRowData, IsLookup, IsCrud) {
        //
        this.pullFields.push(field)

    }


}



//add meta_column in gridFunctions
function ServerRowToUiRow(queryRowData, IsLookup, IsCrud) {
    //parses queryRowData into rowData for grid.

    let rowData = {}
    let keys = Object.keys(queryRowData)
    for(let i =0; i < keys.length; i++ ) {
        let field = keys[i]
        let isCrud = IsCrud[field] || false
        if (! isCrud ) {continue}
        if (isCrud === 'w') {continue}
        //If IsLookup
        if (! IsLookup.hasOwnProperty(field) ) {
            let val = LookupParse(column_name, queryRowData)
            rowData[field] = val
        } else { rowData[field] = queryRowData[keys[i].trim()] }
    }
    return rowData
}

function ColumnLookupFields(serverRowData) {
    /*
    Converts xyz to xyz. .operator is special
    if field has . assumes base string is field and lookup field is after


    */
    let fields = Object.keys(serverRowData)
    let lookups = {}
    let rowData = {}
    for(let i =0; i< fields.length; i++ ) {
        let fx = fields[i]
        if (fx.includes('.')) {
            let fk = fx.split(".")[0]
            lookups[fk] = {}
        }
        rowData[fx] = serverRowData[fx]
    }
    for(let i =0; i < fields.length; i++ ) {
        if (fx.includes('.')) {
            let fk = fx.split(".")[0]
            let lk = fx.split(".")[1]
            lookups[fk][lk] = rowData[fk]
        } else if (lookups.hasOwnProperty(fx) ) {
            lookups[fx][fx] = rowData[fx]
        }
    }
    for(let i =0; i < fields.length; i++ ) {
        if (fx.includes('.')) {
            let fk = fx.split(".")[0]
            let lk = fx.split(".")[1]
            lookups[fk][lk] = rowData[fk]
        } else if (lookups.hasOwnProperty(fx) ) {
            lookups[fx][fx] = rowData[fx]
        }
    }
    let lks = Object.keys(lookups)
    for(let i =0; i< lks.length; i++) { rowData[lks[i]] = lookups[lks[i]] }
    return rowData
}



//add functionality for aliases later
//error if is string. means no match found
function LookupParse(column_name, queryRowData) {
    let column_value = {}
    let keys = Object.keys(queryRowData)
    let cn_dot = column_name+'.'
    for(let i =0; i < keys.length; i++ ) {
        let value = queryRowData[keys[i]]
        let key = keys[i]
        if (key.startsWith(cn_dot) ) {
            let k2 = key.split('.')
            if (k2.length < 2) {continue}
            column_value[k2[1].trim() ] = value
        }
    }
    return column_value
}


//crud_fields
//ignore primary_key



//Functions below used for processing filter object.
function WhereObject(filter_list) {
    /*
    where_list: contains the where statemenents generated by the modal windows where, order_by and pagination
    where_list_out: container object for req_body. contains processed where statements to send to the server
    */
    let fout = []
    //enforcedFilters
    for(var i =0; i< filter_list.length; i++) {
        AppendFilterRow(fout, filter_list)
    }
    for(let i =0; i< filter_list.length; i++) {
        AppendFilterRow(fout, filter_list)
    }
    return fout
}



function AppendFilterRow(fout, filterRow) {
    let fr = {}
    let operator = filterRow['operator']
    let value  = null
    let value2 = null
    if (data_config.array_parse_types.includes(operator)) {
        let values = ArrayValueParse(filterRow)
        if (values.length === 0) { return }
        value = values
    }

    else if (data_config.between_parse_types.includes(operator)) {
        let values = BetweenValueParse(filterRow)
        if (values.length != 2) { return }
        value = values
    }

    else if (data_config.null_parse_types.includes(operator)) { value = ""}
    else { 
        //if null?
        value = String(filterRow['value']).trim() 
    }
    fr['column_name'] = filterRow['column_name']
    fr['operator']    = operator
    fr['value']       = value
    fr['value2']      = value2
    fout.push(fr)
}

//log warnings?
function ArrayValueParse(filterRow) {
    let value = filterRow['value']
    let data_type = filterRow['dataType']
    let tcFunc = GetTypeCheckFunction(data_type)
    let delim  = DelimiterType (filterRow['delimiter'])
    let values = value.split(delim)
    let out_array = []
    for (let i = 0; i < values.length; i++) {
        if (tcFunc(values[i])) { out_array.push(String(values[i]).trim() ) }
    }
    return out_array
}

function BetweenValueParse(filterRow) {
    let val1 = filterRow['value']
    let val2 = filterRow['value2']
    let data_type = filterRow['dataType']
    let tcFunc = GetTypeCheckFunction(data_type)
    if (tcFunc(val1) && tcFunc(val2) ) { return [String(val1), String(val2)] }
    return []
}

// function TypeCheckFunction(data_type) {
function GetTypeCheckFunction(data_type) {
    let dc = data_config.ReturnDataClass(data_type)
    if (dc === 'number') { return type_check.IsNumber}
    else if (dc === 'date')  {
        if (['datetime', 'timestamp', 'timestampz'].includes(data_type)) { return type_check.IsDateTime } 
        else if (data_type === 'time') { return type_check.IsTime }
        else {return type_check.IsDate}
    }
    else if (data_type === 'string') { return type_check.IsString} 
    else if (data_type === 'boolean') { return type_check.IsBoolean}
    else { return type_check.IsString }
}
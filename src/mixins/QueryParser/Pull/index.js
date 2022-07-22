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
const meta_column_name = data_config.meta_column_name

class Pull {
    /*
        filterParams, orderByParams and pageParams is initialized
        by GridParser/index.js
    */
    constructor (columnDefs, filterParams, orderByParams, pageParams) {
        this.columnDefs     = columnDefs
        this.filterParams   = filterParams
        this.orderByParams  = orderByParams
        this.pageParams     = pageParams
        this.pullFields     = []
        this.lookupFields   = []
        //id generator?
    }

    // this.pushFieldParams  = []
    // this.pushLookupParams = {}
    PullParamsInit( ) {
        /*


        */
        let columnDefs = this.columnDefs
        let le = data_config.cellEditors.lookupEditors
        for (let i =0; i < columnDefs.length; i++ ) {
            let grid_column = columnDefs[i]
            let field       = grid_column['field']
            if (field === meta_column) { continue }
            if (! chmodFunc.IsPull( grid_column['chmodParams']  ) ) {continue}
            let ce = grid_column['cellEditor']
            if (le.includes(ce) ) {
                this.lookupFields.push(field)
                this.pullFields.push(field)
            } else { this.pullFields.push(field) }
        }
        this.pullFields.push(meta_column_name)
        this.lookupFields.push(meta_column_name)
    }

    QueryToRowData(queryRowData) {
        /*
        loops throug queryRowData and returns rowData. Checks if fields are lookups and 
        assembles them into an object 
        rowData is then passed to grid_functions update_row function

        queryRowData: {'field1': value, 'field1.subField': value}
        */
        let rowData = {}
        let lookupMapData = {}
        for(let i =0; i < this.pullFields.length; i++) {
            let field = this.pullFields[i]
            rowData[field] = null
            lookupMapData[field] = {}
        }
        let qKeys = Object.keys(queryRowData)
        for(let i =0; i < qKeys.length; i++ ) {
            let qKey = qKeys[i]
            if (this.lookupFields.includes(qkey) ) {
                //if xyz else if
                lookupMapData[field][qKey] = String(queryRowData[qKey])
                continue
            }
            if (qKey.includes('.')) {
                let keyx        = qKey.split('.')
                let fieldKey    = keyx[0].trim()
                let subFieldKey = keyx[1].trim() 
                if (fieldKey === "" || subFieldKey === "")   { continue }
                if (! this.lookupFields.includes(fieldKey) ) { continue }
                lookupMapData[fieldKey][subFieldKey] = String( queryRowData[qKey] )
                continue
            }
            if (this.pullFields.includes(qKey) ) {rowData[qKey] = String( queryRowData[qKey] )  }
        }
        for(let i =0; i< this.lookupFields.length; i++) {
            let field = this.lookupFields[i]
            if (Object.keys(lookupMapData[field]).length > 0) {
                rowData[field] = lookupMapData[field]
            }
        }
        return rowData
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
    //Functions below used for processing filter object.
    WhereObject(filter_list) {
        /*
        where_list: contains the where statemenents generated by the modal windows where, order_by and pagination
        where_list_out: container object for req_body. contains processed where statements to send to the server
        */
        let fout = []
        let filter_list = this.filterParams['current']
        let enforced_filter_list = this.filterParams['enforcedFilters']
        //enforcedFilters
        for(var i =0; i< enforced_filter_list.length; i++) {
            let frow = enforced_filter_list[i]
            AppendFilterRow(fout, frow)
        }
        for(let i =0; i< filter_list.length; i++) {
            let frow = filter_list[i]
            AppendFilterRow(fout, frow)
        }
        return fout
    }
    AppendFilterRow(fout, filterRow) {
        let fr = {}
        let operator = filterRow['operator']
        let value  = null
        if (data_config.array_parse_types.includes(operator)) {
            let values = ArrayValueParse(filterRow)
            if (values.length === 0) { return }
            value  = values
        }

        else if (data_config.between_parse_types.includes(operator)) {
            let values = BetweenValueParse(filterRow)
            if (values.length != 2) { return }
            value  = [values[0], values[1] ]
        }

        else if (data_config.null_parse_types.includes(operator)) { }
        else { 
            //if null?
            let valuex = filterRow['value']
            if (valuex === null ) {return}
            value = String(filterRow['value']).trim() 
        }
        fr['column_name'] = filterRow['column_name']
        fr['operator']    = operator
        fr['value']       = value
        fout.push(fr)
    }
    ArrayValueParse(filterRow) {
        //delimiterType

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

    BetweenValueParse(filterRow) {
        let val1 = filterRow['value']
        let val2 = filterRow['value2']
        let data_type = filterRow['dataType']
        let tcFunc = GetTypeCheckFunction(data_type)
        if (tcFunc(val1) && tcFunc(val2) ) { return [String(val1), String(val2)] }
        return []
    }

    // function TypeCheckFunction(data_type) {
    GetTypeCheckFunction(data_type) {
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
}

module.exports = Pull
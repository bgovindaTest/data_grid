/*
Initializes parameters for pulling and pushing data

filter, sortList and pagination. 
showFilter
showSort
Should run after
defaultParameters

{'column_name': 'col_name_3', 'operator': '!=', 'value':  'a', 'value2': null}

*/
const type_check  = require('../../../TypeCheck')
const data_config = require('../../../DataConfig')
const { between_parse_types } = require('../../../DataConfig')

// valid_operators = {'=': '=', '!=': '!=', 
//     '<>': '<>', '>':'>', '>=': '>=', 
//     '<': '<', '<=': '<=', 
//     'lt': '<', 'le':'<=' , 'gt': '>',
//     'ge': '>=', 'eq': '=', 'neq': '!=',
//     'in':'IN',
//     'not_in': "NOT IN", 
//     'similar': "SIMILAR TO", 'not_similar': "NOT SIMILAR TO",
//     'like': "LIKE",  'not_like': "NOT LIKE", 'ilike': "ILIKE",
//     'not_ilike': "NOT ILIKE",
//     'between': "BETWEEN SYMMETRIC", 'not_between': "NOT BETWEEN SYMMETRIC" , 'is_null': "IS NULL", 
//     'is_not_null': "IS NOT NULL",
//     //create in statements with like and ilike 
//     'like_in': "LIKE ANY", 'not_like_in': "NOT LIKE ALL",
//     'ilike_in': "ILIKE ANY", 'not_ilike_in': "NOT ILIKE ALL",
// }

// between_parse_types


class QueryParams {
    constructor (grid) { this.grid = grid }
    QueryParamsInit() {
        /*
            Runs for main grid. Returns query Params object for pagination, filter
            and orderBy
        */

        //field, column_name, headerName, data_type
        let grid = this.grid
        let getParams  = this.FilterOrderByObjectInit(grid)
        let pageParams = this.PageInit()
        getParams['pageParams'] = pageParams
        return getParams
    }

    SubGridQueryParamsInit(rowData, rowFilterDefaults ) {
        /*
            Runs for sub grid. Returns query Params object for pagination, filter
            and orderBy. parses rowData and rowFilterDefault params object in
            subgrid column params.

            defaultFilter: {subGridKey: {rowKey: , operator: ,rowKey2:   } } 
                if paramsKey exists assumbes rowData field is object or array.
                other wise just return value direclty from array. Should clone if 
                object so child cant change value.

        */
        this.SubGridDefaultFilter( rowData, rowFilterDefaults )
        let qparams = this.QueryParamsInit()
        return qparams
    }


    FilterOrderByObjectInit() {
        /*
            //run twice once for filterParams and once for orderByParams


        */


        let grid = this.grid

        let filterList = []
        let enforcedFilter = []
        let defaultFilter  = []
        let defaultSort = []
        let sortList = []
        for(let i=0; i < grid.length; i++) {
            let grid_column = grid[i]
            this.QueryModalDisplayInit(grid_column)
            this.AddFilter(grid_column, defaultFilter, enforcedFilter)
            this.AddOrderBy(grid_column, defaultSort, sortList)    
        }
        let filterParams  = {'current': defaultFilter, 'new': [], 'filterList': filterList, 'enforcedFilters': enforcedFilter}
        let orderByParams = {'current': defaultSort, 'new': [], 'orderByList': sortList}
        return {'filterParams': filterParams, 'orderByParams': orderByParams}
    }
    QueryModalDisplayInit(grid_column) {
        grid_column['showFilter'] = grid_column['showFilter'] || false
        grid_column['showSort'] = grid_column['showSort'] || false


    }

    AddFilter(grid_column, defaultFilter, enforcedFilter) {
        let dFV = this.CreateFilterValue(grid_column)
        //if value doesnt exists ignore defaultFilter
        let defaultValue = defaultFilterValue.value
        let showFilter   = grid_column['showFilter']
        if (defaultValue.trim() != "" && !showFilter ) { enforcedFilter.push(dFV) } 
        else if  ( defaultValue.trim() != "" && showFilter ) {
            defaultFilter.push(dFV)
            filterList.push({'headerName': dFV['headerName'], 'column_name': dFV['column_name'], 'dataType': dFV['dataType'] })
        } else if (showFilter) {
            filterList.push({'headerName': dFV['headerName'], 'column_name': dFV['column_name'], 'dataType': dFV['column_name'] })
        }
    }
    CreateFilterValue(  grid_column ) {
        //column_name comes from field
        //{'column_name': 'col_name_3', 'operator': '!=', 'value':  'a', 'value2': null, delimiterType: null, dataType: null }
        //only require { 'operator': '!=', 'value':  'a', 'value2': null }
        let defValue = grid_column['defaultFilter'] //basic type or object above
        let defOperator  = grid_column['defaultOperator'] || "="
        let headerName = grid_column['headerName'] || grid_column['field']
        let dataType = grid_column['dataType'] || 'text'
        let field = grid_column['field']

        if (! data_config.valid_operators.hasOwnProperty(defOperator)) { defOperator = '=' }



        if (type_check.IsBasicType(defValue) ) {
            let x = {'headerName': headerName, 'column_name': field, 'dataType': dataType, 'operator': '=', 'value': String(defValue),
                'value2': null, delimiterType: null }
            if (type_check.IsNull(defValue) ) { x['value'] = defValue }
            return x
        }
        //is object syntax
        defValue['column_name'] = field
        defValue['dataType']    = dataType
        if (! defValue.hasOwnProperty('value2')) {defValue['value2'] = null}
        if (! defValue.hasOwnProperty('operator')) {defValue['operator'] = '='}
        if (! defValue.hasOwnProperty('value')) {defValue['value'] = null }
        if (! defValue.hasOwnProperty('delimiterType')) {defValue['delimiterType'] = null}
        //check valid operator
        if (between_parse_types.hasOwnProperty(defOperator)) {
            let v1 = defValue['value']
            let v2 = defValue['value2']
            if (type_check.IsNull(v1) || type_check.IsNull(v2) ) { defValue['operator'] = '=' }
        }
        return defValue


    }


    AddOrderBy() {
        let showFilter = grid_column['showFilter'] || false
        let showSort   = grid_column['showSort'] || false
        let defaultOrderby = grid_column['defaultOrderby'] || ""
        let defaultValue = grid_column['defaultFilter'] || ""
        let defOperator  = grid_column['defaultOperator'] || "="
        let field = grid_column['field']
        let headerName = grid_column['headerName'] || grid_column['field']
        let dataType = grid_column['dataType'] || 'text'

        if (showSort) {
            if (defaultOrderby !== "") {
                if (defaultOrderby.toLowerCase() === 'asc') {
                    defaultSort.push({'headerName': headerName, 'column_name': field, 'order_by': 'asc' } )
                    sortList.push({'headerName': headerName, 'column_name': field } )
                } else if ( defaultOrderby.toLowerCase() === 'desc' ) {
                    defaultSort.push({'headerName': headerName, 'column_name': field, 'order_by': 'desc' } )
                    sortList.push({'headerName': headerName, 'column_name': field } )
                }
            } else { sortList.push({'headerName': headerName, 'column_name': field }) }
        }

    }


    PageInit() {
        let page_size = data_config.page_size
        let limit  = page_size
        return {'limit': limit, 'offset': 0, 'page_index': 0, 'page_size': page_size }
    }

    SubGridDefaultFilter( rowData, rowFilterDefaults ) {
        /*
        rowDataDefaults = {
            defaultFilter: {subGridKey: {rowKey: , operator: ,rowKey2:   } } 
        }
        */
        let gridDefaultValues = {}
        let subgrid = this.grid

        let subGridFields = Object.keys(rowFilterDefaults)
        for (let i =0; i < subGridFields.length; i++ ) {
            let sgx    = subGridFields[i]
            let rowKey = sgx['rowKey']
            dx = {}
            if (sgx.hasOwnProperty('paramsKey') ) {
                let pkey  = sgx['paramsKey']
                let value = rowData[rowKey][pkey]
                gridDefaultValues[sgx] = String(value)
            } else {
                let value = rowData[rowKey]
                gridDefaultValues[sgx] = String(value)
            }
        }
        for (let i =0; i < subgrid.length; i++ ) {
            let field = subgrid['field']
            if (! gridDefaultValues.hasOwnProperty(field) ) { continue }
            let dataType = this.DataType(grid_column)
            let dx = gridDefaultValues[field]
            dx['dataType'] = dataType
            subgrid['defaultFilter'] = dx
        }
    }

}

module.exports = QueryParams
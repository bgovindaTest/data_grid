/*
Initializes parameters for pulling and pushing data

filter, sortList and pagination. 
showFilter: boolean
showSort: boolean
Should run after
defaultParameters

{'column_name': 'col_name_3', 'operator': '!=', 'value':  'a', 'value2': null}

*/
const type_check  = require('../../../TypeCheck')
const data_config = require('../../../DataConfig')



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
            Creates filters and sort objects for queries. Parses grid object for
            default parameters for filtering and sorting.
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
            this.AddFilter(grid_column, filterList, defaultFilter, enforcedFilter)
            this.AddOrderBy(grid_column, sortList , defaultSort)    
        }
        let filterParams  = {'current': defaultFilter, 'new': [], 'filterList': filterList, 'enforcedFilters': enforcedFilter}
        let orderByParams = {'current': defaultSort,   'new': [], 'orderByList': sortList,  }
        return {'filterParams': filterParams, 'orderByParams': orderByParams}
    }
    QueryModalDisplayInit(grid_column) {
        /*
            Adds default values for showFilter and showSort.
        */
        // console.log(grid_column)
        let showFilter = grid_column['showFilter']
        console.log(showFilter)
        console.log( type_check.IsBoolean(showFilter) )
        if (! type_check.IsBoolean(showFilter) ) {
            if (grid_column.hasOwnProperty('defaultFilter') ) { grid_column['showFilter'] =  true } 
            else {  grid_column['showFilter'] = false } 
        }

        let showSort = grid_column['showSort']
        if (! type_check.IsBoolean(showSort)) {
            if (grid_column.hasOwnProperty('defaultSort') ) { grid_column['showSort'] = true } 
            else { grid_column['showSort'] = false }
        }
        // console.log(grid_column)
    }

    AddFilter(grid_column, filterList, defaultFilter, enforcedFilter) {
        /*



            //if value doesnt exists ignore defaultFilter
        */
        if (grid_column.hasOwnProperty('defaultFilter') ) {
            let dFV = this.CreateFilterValue(grid_column)
            let showFilter   = grid_column['showFilter']
            // console.log(showFilter)
            if (!showFilter ) { enforcedFilter.push(dFV) }
            else if  ( showFilter ) {
                defaultFilter.push(dFV)
                filterList.push({'headerName': dFV['headerName'], 'column_name': dFV['column_name'], 'dataType': dFV['dataType'] })
            } else if (showFilter) {
                filterList.push({'headerName': dFV['headerName'], 'column_name': dFV['column_name'], 'dataType': dFV['column_name'] })
            }
        } else {
            let showFilter   = grid_column['showFilter']
            if (showFilter) {
                filterList.push({'headerName': dFV['headerName'], 'column_name': dFV['column_name'], 'dataType': dFV['column_name'] })
            }
        }


    }
    CreateFilterValue(  grid_column ) {
        /*


            //column_name comes from field
            //{'column_name': 'col_name_3', 'operator': '!=', 'value':  'a', 'value2': null, delimiterType: null, dataType: null }
            //only require { 'operator': '!=', 'value':  'a', 'value2': null }
        */
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

    //(grid_column, sortList , defaultSort,   enforcedSort)
    AddOrderBy(grid_column, sortList, defaultSort) {
        /*
            Adds sortList for modal window and initialized order by
            defaultSort: 'asc'/'desc'
        */
        let showSort   = grid_column['showSort']
        let defaultOrderby = grid_column['defaultOrderby'] || ""
        let field = grid_column['field']
        let headerName = grid_column['headerName'] || grid_column['field']

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
            Takes rowData values and adds to defaultFilter value.

            rowDataDefaults = {
                defaultFilter: {subGridKey: {rowKey: , operator: ,rowKey2: , paramsKey: , paramsKey2:, delimiterType: null,  } } 
            }

            //dataType added in CreateFilterValue
            {'column_name': 'col_name_3', 'operator': '!=', 'value':  'a', 'value2': null, delimiterType: null, dataType: null }

        */
        let gridDefaultValues = {}
        let subgrid = this.grid

        let subGridFields = Object.keys(rowFilterDefaults)
        for (let i =0; i < subGridFields.length; i++ ) {
            let sgKey    = subGridFields[i] //subGridKey
            let rfVals   = rowFilterDefaults[sgKey] //{rowKey: , operator: ,rowKey2: , paramsKey: , paramsKey2:, delimiterType: null,  }
            let rowDataKey = rfVals['rowKey']
            let val1 = rowData[rowDataKey]
            defVals = {}
            if (rfVals.hasOwnProperty('paramsKey') )     { val1 = val1[rfVals['paramsKey']] }
            defVals['delimiterType'] = rfVals['delimiterType'] || null
            defVals['column_name']   = sgKey
            defVals['operator']      = rfVals['operator'] || '='
            defVals['value2']        = null

            if (!sgx.hasOwnProperty('rowKey2') ) { 
                gridDefaultValues[sgKey] = defVals
                continue
            }
            let rowDataKey2 = rfVals['rowKey2']
            let val2 = rowData[rowDataKey2]

            if (rfVals.hasOwnProperty('paramsKey') ) { val2 = val2[rfVals['paramsKey2']] }
            defVals['value2'] = val2
            gridDefaultValues[sgx] = gridDefaultValues
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
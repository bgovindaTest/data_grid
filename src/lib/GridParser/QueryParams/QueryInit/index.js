/*
Initializes parameters for pulling and pushing data

filter, sortList and pagination. 
showFilter
showSort
Should run after
defaultParameters

*/


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
            let showFilter = grid_column['showFilter'] || false
            let showSort   = grid_column['showSort'] || false
            let defaultOrderby = grid_column['defaultOrderby'] || ""
            let defaultValue = grid_column['defaultFilter'] || ""
            let defOperator  = grid_column['defaultOperator'] || "="
            let field = grid_column['field']
            let headerName = grid_column['headerName'] || grid_column['field']
            let dataType = grid_column['dataType'] || 'text'
            if (defaultValue.trim() != "" && !showFilter ) {
                //enforced filter
                enforcedFilter.push({'headerName': headerName, 'column_name': field, 'dataType': dataType, 'operator': defOperator, 'value':  defaultValue })
            } else if  ( defaultValue.trim() != "" && showFilter ) {
                //default filter
                defaultFilter.push({'headerName': headerName, 'column_name': field, 'dataType': dataType, 'operator': defOperator, 'value':  defaultValue })
                filterList.push({'headerName': headerName, 'column_name': field, 'dataType': dataType })
            } else if (showFilter) {
                //just add to available filters
                filterList.push({'headerName': headerName, 'column_name': field, 'dataType': dataType })
            }
    
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
        let filterParams  = {'current': defaultFilter, 'new': [], 'filterList': filterList, 'enforcedFilters': enforcedFilter}
        let orderByParams = {'current': defaultSort, 'new': [], 'orderByList': sortList}
        return {'filterParams': filterParams, 'orderByParams': orderByParams}
    }
    PageInit() {
        let page_size = data_config.page_size
        let limit  = page_size
        return {'limit': limit, 'offset': 0, 'page_index': 0, 'page_size': page_size }
    }

    SubGridDefaultFilter( rowData, rowFilterDefaults ) {
        /*
        rowDataDefaults = {
            'defaultValues':  {subGridKey: {rowKey: , paramsKeys:  ifNullSet: boolean  } } 
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
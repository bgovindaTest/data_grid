/*
Initializes parameters for pulling and pushing data



*/

//end pagination functions
function InitializeQueryParams(grid) {
    //field, column_name, headerName, data_type
    let getParams = FilterOrderByObjectInit(grid)
    let pageParams = PageInit()
    getParams['pageParams'] = pageParams
    return getParams
}


function FilterOrderByObjectInit(grid) {
    //run twice once for filterParams and once for orderByParams
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
        let defaultValue = grid_column['defaultValue'] || ""
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

function PageInit() {
    let page_size = data_config.page_size
    let limit  = page_size
    return {'limit': limit, 'offset': 0, 'page_index': 0, 'page_size': page_size }
}

// rowDataDefaults = {
//     'defaultFilter': {} key value? fro row params
//     'defaultSort': []
//     'enforcedFilters': {}
//     'defaultValue':  {}
// }


function SubGridQueryInit() {}
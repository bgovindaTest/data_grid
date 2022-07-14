/*
Maintains state of filter, order_by and paginations objects. Object description in
GridParams QueryParser

let filterParams  = {'current': defaultFilter, 'new': [], 'filterList': filterList, 'enforcedFilters': enforcedFilter}
let orderByParams = {'current': defaultSort,   'new': [], 'orderByList': sortList,  }


*/



const data_config = require ('../../../DataConfig')
const type_check = require('../../../TypeCheck')

/*
Copies parameters in new filter and order by object and sets it to current.
Query assembly uses the current object to create payload

Only copy data to key so references dont break
*/
function NewQuerySet(filterParams, orderByParams, pageParams ) {
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

/*
Updates pagination index and value of limit.
i is +-1 for page change
*/
function ChangePage(i, page_params) {
    let page_index = page_params['page_index']
    if(type_check.IsInteger(i) ) {
        page_index = page_index + parseInt(i)
    } else {page_index = 0 }

    if (page_index < 0) { page_index = 0 }
    let page_size = page_params['page_size']
    page_params['limit']  = (1+page_index)*page_size
    page_params['offset'] = page_index*page_size
}


//Used for when new filter value is selected creates default object
function DefaultFilterInit(column_name, header_name, data_type) {
    let def_operator = data_config.DefaultOperator(data_type_name)
    let init_filter = {'column_name': column_name, 'operator': def_operator, 'value':  null, 
        'value2': null, 'delimiterType': null, 'dataType': data_type,
        'headerName': header_name }
    return init_filter
}

//Clears values set in filter.
function ClearFilterValue( filterObjectRow ) {
    let data_type = filterObjectRow['dataType']
    filterObjectRow['value']    = null
    filterObjectRow['value2']   = null
    filterObjectRow['operator'] = data_config.DefaultOperator(data_type_name)
}

//Defaults to ascending when adding new sort by object
function DefaultOrderByInit(column_name, header_name) {
    let init_order = {'column_name': column_name, 'order_by': 'asc', 'headerName': header_name}
    return init_order
}

//Availablle OrderBy options 'orderByList
function OrderByDisplayList( new_list, full_list ) {
    let display_list = []
    for (let i =0; i < full_list.length; i++) {
        let cnf = full_list[i]['column_name']
        //
    }


}


//removes object from array. Used when filter is deleted.
function RemoveFilterOrderBy(  filter_orderby_array, index )  { 
    if (index > -1) { filter_orderby_array.splice(index, 1) }
    RemoveItemFromArray( filter_array, index) 
}

//
function ClearFilterOrderBy(filter_orderby_array)  { filter_orderby_array.length = 0 }


function ClearFilterValues(filterRow) {

    let def_operator = data_config.DefaultOperator(data_type_name)
    filterRow['value'] = null
    filterRow['value2'] = null
    filterRow['delimiterType'] = null
    filterRow['operator'] = def_operator
}

function DelimiterList( ) {}

function SetDelimiterType (filterRow, delimiter_type) {
    //{ '/\s+/':'Any Space'}
    let defaultDelimiter = data_config.defaultDelimiter
    if (data_type.delimiter_typeName.hasOwnProperty(delimiter_type)) {
        return delimiter_type
    }
    return defaultDelimiter
} 
//how to split and return value






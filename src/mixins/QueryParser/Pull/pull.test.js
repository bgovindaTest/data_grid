const Pull = require('./index.js')
const gp = require('../../../lib/GridParser')


function ReturnColumnDefs() {
    let columnDefs = [
        {'field': 'a',  'editable': true, 'dataType': 'numeric', 'defaultFilter': 1, 'showFilter': false, 'showSort': false },
        {'field': 'b',  'editable': true, 'defaulFilter': 'b filter', 'showFilter': true, 'showSort': true},
        {'field': 'c',  'chmodParams': 'r', 'cellEditor': 'autoCompleteEditor', 'dataType': 'text', 'showFilter': true, 'showSort': true},
        {'field': 'id', 'chmodParams': 'rw','defaultFilter': '-1', 'showFilter': false,},
    ]
    return columnDefs
}


test('pull Init', () => {
    let columnDefs = ReturnColumnDefs()
    let x = new gp(columnDefs,{}, 0)
    let grid = x.RunGridColumnsInit()
    let qp = grid['queryParams']

    px = new Pull(grid['columnDef'], qp.filterParams, qp.orderByParams, qp.pageParams)
    px.PullParamsInit()
    let res = {
        'pullFields': [ 'a', 'b', 'c', 'id', '_ag-meta_' ],
        'lookupFields': [ 'c', '_ag-meta_' ]
    }
    let exp = {
        'pullFields': px.pullFields,
        'lookupFields': px.lookupFields,
    }
    expect(exp).toMatchObject(res)
})

test('server data to rowData', () => {
    let columnDefs = ReturnColumnDefs()
    let x = new gp(columnDefs,{}, 0)
    let grid = x.RunGridColumnsInit()
    let qp = grid['queryParams']

    px = new Pull(grid['columnDef'], qp.filterParams, qp.orderByParams, qp.pageParams)
    px.PullParamsInit()
    let serverData = { 'a': 2, 'c': 'x', 'c.a': 'ca', '_ag-meta_.crudType': 'insert' }
    let rowData = px.QueryToRowData(serverData)
    let exp = { a: '2', b: null, c: { c: 'x', a: 'ca' },
        id: null, '_ag-meta_': { crudType: 'insert' }
    }
    expect(exp).toMatchObject(rowData)
})



// NewQueryParams() 
// PreviousPageParams() 
// NextPageParams()  
// urlParams
// NewQuerySet()
// //pagination functions
// ChangePage(i)
// GetRouteParam
// OrderByObject()
// PaginationObject()
// //Functions below used for processing filter object.
// WhereObject()
// AppendFilterRow
// ArrayValueParse(filterRow) 
// BetweenValueParse
// // function TypeCheckFunction(data_type) {
// GetTypeCheckFunction
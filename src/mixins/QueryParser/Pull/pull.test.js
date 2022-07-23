const Pull = require('./index.js')
const gp = require('../../../lib/GridParser')


function ReturnColumnDefs() {
    let columnDefs = [
        {'field': 'a',  'editable': true, 'dataType': 'numeric', 'defaultFilter': 1, 'showFilter': false, 'showSort': false },
        {'field': 'b',  'editable': true, 'defaultFilter': 'b filter', 'showFilter': true, 'showSort': true},
        {'field': 'c',  'chmodParams': 'r', 'cellEditor': 'autoCompleteEditor', 'defaultSort': 'asc', 'dataType': 'text', 'showFilter': true, 'showSort': true},
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

test('query params defaults', () => {
    let columnDefs = ReturnColumnDefs()
    let x = new gp(columnDefs,{}, 0)
    let grid = x.RunGridColumnsInit()
    let qp = grid['queryParams']

    px = new Pull(grid['columnDef'], qp.filterParams, qp.orderByParams, qp.pageParams)


    px.PullParamsInit()
    let urlParams = px.GetRouteParams( )
    let res = {
        where: [
          { column_name: 'a', operator: '=', value: '1' },
          { column_name: 'id', operator: '=', value: '-1' },
          { column_name: 'b', operator: '=', value: 'b filter' }
        ],
        order_by: [ { column_name: 'c', order_by: 'asc' } ],
        limit: '10000',
        offset: '0'
      }
    expect(res).toMatchObject(urlParams)
})

test('query params next page pushed twice', () => {
    let columnDefs = ReturnColumnDefs()
    let x = new gp(columnDefs,{}, 0)
    let grid = x.RunGridColumnsInit()
    let qp = grid['queryParams']
    px = new Pull(grid['columnDef'], qp.filterParams, qp.orderByParams, qp.pageParams)
    px.PullParamsInit()
    px.NextPageParams() 
    let urlParams = px.NextPageParams()
    let res = {
        where: [
          { column_name: 'a', operator: '=', value: '1' },
          { column_name: 'id', operator: '=', value: '-1' },
          { column_name: 'b', operator: '=', value: 'b filter' }
        ],
        order_by: [ { column_name: 'c', order_by: 'asc' } ],
        limit: '10000',
        offset: '20000'
    }
    expect(res).toMatchObject(urlParams)
})

test('new query', () => {
    let columnDefs = ReturnColumnDefs()
    let x = new gp(columnDefs,{}, 0)
    let grid = x.RunGridColumnsInit()
    let qp = grid['queryParams']
    px = new Pull(grid['columnDef'], qp.filterParams, qp.orderByParams, qp.pageParams)
    px.PullParamsInit()
    qp['filterParams']['new'] = [
        {
          headerName: 'b',
          column_name: 'b',
          dataType: 'text',
          operator: 'in',
          value: ' b filter, happy \nwhats ups, example',
          value2: null,
          delimiterType: '\n'
        },
        {
            headerName: 'b',
            column_name: 'b',
            dataType: 'text',
            operator: 'between',
            value: 'a12',
            value2: 'b12',
            delimiterType: '\n'
        }
    ]


    qp['orderByParams']['new'] = [
        { headerName: 'b', column_name: 'b', order_by: 'desc' }
    ]

    px.NewQuerySet()
    let urlParams = px.GetRouteParams( )
    let res = {
        where: [
          { column_name: 'a', operator: '=', value: '1' },
          { column_name: 'id', operator: '=', value: '-1' },
          { column_name: 'b', operator: 'in', value: [ 'b filter, happy', 'whats ups, example' ] },
          { column_name: 'b', operator: 'between', value: [ 'a12', 'b12' ] }
        ],
        order_by: [ { column_name: 'b', order_by: 'desc' } ],
        limit: '10000',
        offset: '0'
      }
    expect(res).toMatchObject(urlParams)
})
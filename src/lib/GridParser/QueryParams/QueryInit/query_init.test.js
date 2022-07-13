/*



*/

const qp = require('./index.js')

function SetDefaults(grid) {
    for (let i =0; i< grid.length; i++) {
        let grid_column = grid[i]
        if (!grid_column.hasOwnProperty('headerName') ) {grid_column['headerName'] = grid_column['field'].toUpperCase()}
        if (!grid_column.hasOwnProperty('dataType')   ) {grid_column['dataType']   = 'text'}
    }
}


test('import query_init', () => {
    expect(true).toBe(true)
})


// test('import query_init', () => {
//     let grid = [{'field': 'A', 'editable': true}]
//     SetDefaults(grid)
//     let x = new qp(grid)
//     let y =x.QueryParamsInit()
//     console.log(grid)
//     console.log(y)
//     expect(true).toBe(true)
//     // expect(crud_params).toMatchObject(exp)
// })

test('filter assembly', () => {
    let grid = [
        {'field': 'a', 'editable': true, 'defaultFilter': true, 'showFilter': false},
        {'field': 'b', 'editable': true, 'defaultFilter': 'a',  'showFilter':  true},
        {'field': 'c', 'editable': true, 'defaultFilter': {'value': 'a', 'value2': 'b', 'operator': 'between'},  'showFilter':  true}
    ]
    SetDefaults(grid)
    let x = new qp(grid)
    let y =x.QueryParamsInit()
    let result = {
        'current': y['filterParams']['current'],
        'filterList': y['filterParams']['filterList'],
        'enforcedFilters': y['filterParams']['enforcedFilters'],
        'new': y['filterParams']['new']
    }
    let expect_result = {
        'current':     [
            {
              headerName: 'B',
              column_name: 'b',
              dataType: 'text',
              operator: '=',
              value: 'a',
              value2: null,
              delimiterType: null
            },
            {
              value: 'a',
              value2: 'b',
              operator: 'between',
              column_name: 'c',
              dataType: 'text',
              headerName: 'C',
              delimiterType: null
            }
          ],
        'filterList': [ { headerName: 'B', column_name: 'b', dataType: 'text' },
            { headerName: 'C', column_name: 'c', dataType: 'text' }
        ],
        'new': [],
        'enforcedFilters': [
            {
              headerName: 'A', column_name: 'a', dataType: 'text', operator: '=',
              value: 'true', value2: null, delimiterType: null
            }
          ]
    }
    expect(result).toMatchObject(expect_result)
})

test('sort assembly', () => {
    let grid = [{'field': 'a', 'editable': true, 'defaultSort': 'asc', 'showSort': true },
        {'field': 'b', 'editable': true, 'defaultSort': 'desc', 'showSort': true },
        {'field': 'c', 'editable': true,  'showSort': false }
    ]
    SetDefaults(grid)
    let x = new qp(grid)
    let y =x.QueryParamsInit()
    let res = {
        'orderByList': y['orderByParams']['orderByList'],
        'current': y['orderByParams']['current'],
        'new': y['orderByParams']['new']
    }
    let expected = {
        'orderByList':     [
            { headerName: 'A', column_name: 'a' },
            { headerName: 'B', column_name: 'b' }
          ],
        'current':     [
            { headerName: 'A', column_name: 'a', order_by: 'asc' },
            { headerName: 'B', column_name: 'b', order_by: 'desc' }
          ],
        'new': []
    }

    expect(res).toMatchObject(expected)
})

// test('filter assembly', () => {
//     let grid = [{'field': 'A', 'editable': true, 'defaultFilter': true}]
//     SetDefaults(grid)
//     let x = new qp(grid)
//     let y =x.QueryParamsInit()
//     console.log(y['filterParams']['current'])
//     console.log(y['filterParams']['filterList'])
//     expect(true).toBe(true)
//     // expect(crud_params).toMatchObject(exp)
// })

// test('sort assembly', () => {
//     let grid = [{'field': 'A', 'editable': true, 'defaultFilter': true}]
//     SetDefaults(grid)
//     let x = new qp(grid)
//     let y =x.QueryParamsInit()
//     console.log(y['filterParams']['current'])
//     console.log(y['filterParams']['filterList'])
//     expect(true).toBe(true)
//     // expect(crud_params).toMatchObject(exp)
// })
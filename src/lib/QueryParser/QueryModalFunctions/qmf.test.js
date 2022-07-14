const qp = require('../../GridParser/QueryParams')
const qmf    = require('./index.js')

function SetDefaults(grid) {
    for (let i =0; i< grid.length; i++) {
        let grid_column = grid[i]
        if (!grid_column.hasOwnProperty('headerName') ) {grid_column['headerName'] = grid_column['field'].toUpperCase()}
        if (!grid_column.hasOwnProperty('dataType')   ) {grid_column['dataType']   = 'text'}
    }
}


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
        'new': [
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
        'enforcedFilters': [
            {
              headerName: 'A', column_name: 'a', dataType: 'text', operator: '=',
              value: 'true', value2: null, delimiterType: null
            }
          ]
    }
    expect(result).toMatchObject(expect_result)
})
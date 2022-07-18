const qp = require('../../GridParser/QueryParams')
const qmf    = require('./index.js')
const lodashCloneDeep = require('lodash.clonedeep')

function SetDefaults(grid) {
    for (let i =0; i< grid.length; i++) {
        let grid_column = grid[i]
        if (!grid_column.hasOwnProperty('headerName') ) {grid_column['headerName'] = grid_column['field'].toUpperCase()}
        if (!grid_column.hasOwnProperty('dataType')   ) {grid_column['dataType']   = 'text'}
    }
}

const test_grid = SetDefaults([
  {'field': 'a', 'editable': true, 'defaultFilter': true, 'showFilter': false, 'showSort': true},
  {'field': 'b', 'editable': true, 'defaultFilter': 'a',  'showFilter':  true, 'showSort': true},
])


test('new query set', () => {
  let grid = lodashCloneDeep(test_grid)
  let x = new qp(grid)
  let y =x.QueryParamsInit()

  qmf.NewQuerySet,
  expect(result).toMatchObject(expect_result)
})

// qmf.NewQuerySet,
// qmf.ChangePage,
// qmf.DefaultFilterInit,
// qmf.ClearFilterValue,
// qmf.DefaultOrderByInit,
// qmf.OrderByDisplayList,
// qmf.RemoveFilterOrderBy,
// qmf.ClearFilterOrderBy,
// qmf.ClearFilterValues,
// qmf.SetDelimiterType,
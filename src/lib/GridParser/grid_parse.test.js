const gp = require('./index.js')
const lodashCloneDeep = require('lodash.clonedeep')

function SetDefaults(grid) {
    for (let i =0; i< grid.length; i++) {
        let grid_column = grid[i]
        if (!grid_column.hasOwnProperty('headerName') ) {grid_column['headerName'] = grid_column['field'].toUpperCase()}
        if (!grid_column.hasOwnProperty('dataType')   ) {grid_column['dataType']   = 'text'}
    }
}

const test_grid = [
  {'field': 'a', 'editable': true, 'defaultFilter': true, 'showFilter': false, 'showSort': true, 'validator': 'a < 1'},
  {'field': 'b', 'editable': true, 'defaultFilter': 'a',  'showFilter':  true, 'showSort': true},
]


test('new query set', () => {
  let grid = lodashCloneDeep(test_grid)
  let x = new qp(grid)
  let y =x.QueryParamsInit()

  qmf.NewQuerySet,
  expect(result).toMatchObject(expect_result)
})







test('ifNull', () => {
    let x = new cdef({},{}, {})
    let grid_column = {
        'field': 'test',
        'ifNull': 'test + 1'
    }
    x.IfNull(grid_column)
    let sx = grid_column['ifNull']
    expect(sx).toBe('null')
})

test('ifNull default', () => {
    let x = new cdef({},{}, {})
    let grid_column = {
        'field': 'test',
        'ifNull': 'default'
    }
    x.IfNull(grid_column)
    let sx = grid_column['ifNull']
    console.log(sx)
    expect(sx).toBe('default')
})



test('initialize delete/undo button', () => {
    //prepends delete/undo
    let grid = [
        {
            'field': 'test',
            'ifNull': 'default',
            'isCrud': true
        }
    ]
    let x = new cdef({},{}, {})
    x.InitializeDeleteUndoColumn(grid)
    expect(true).toBe(true)
})



test('cellClassRules intialized with validator', () => {
    //prepends delete/undo
    let grid_column =
        {
            'field': 'test',
            'ifNull': 'default',
            'isCrud': true,
            'validator': 'test > 1',
            'cellClassRules': {}
        }
    let x = new cdef({},{}, {})
    x.Validators(grid_column)
    x.CellClassRules(grid_column)
    let params = {'data': {'test': 2} }
    let cc = grid_column['cellClassRules']
    let res = [cc['editable_pass_style'](params), cc['editable_error_style'](params),
        cc['non_editable_pass_style'](params), cc['non_editable_error_style'](params) ]
    expect(res).toMatchObject([false, false, true, false])
})

test('cellClassRules intialized with validator editable', () => {
    //prepends delete/undo
    let grid_column =
        {
            'field': 'test',
            'ifNull': 'default',
            'isCrud': true,
            'editable': true,
            'validator': 'test > 1',
            'cellClassRules': {}
        }
    let x = new cdef({},{}, {})
    x.Validators(grid_column)
    x.CellClassRules(grid_column)
    let params = {'data': {'test': 2} }
    let cc = grid_column['cellClassRules']
    let res = [cc['editable_pass_style'](params), cc['editable_error_style'](params),
        cc['non_editable_pass_style'](params), cc['non_editable_error_style'](params) ]
    expect(res).toMatchObject([true, false, false, false])
})

test('cellClassRules empty', () => {
    //prepends delete/undo
    let grid_column =
        {
            'field': 'test',
            'ifNull': 'default',
            'isCrud': true,
            'cellClassRules': {}
        }
    let x = new cdef({},{}, {})
    x.Validators(grid_column)
    x.CellClassRules(grid_column)
    let fn = grid_column['cellClassRules']['editable_pass_style']
    expect(fn({})).toBe(true)
})

test('default order by', () => {
    let grid = [
        { 'field': 'a', 'defaultOrderBy': 'asc'},
        { 'field': 'b'},
        { 'field': 'c', 'defaultOrderBy': 'desc'},
        { 'field': 'd', 'defaultOrderBy': 'x'}
    ]
    let defaultOrderBy = []
    let x = new cdef({},{}, {})
    x.DefaultOrderBy(grid[0], defaultOrderBy)
    x.DefaultOrderBy(grid[1], defaultOrderBy)
    x.DefaultOrderBy(grid[2], defaultOrderBy)
    x.DefaultOrderBy(grid[3], defaultOrderBy)
    let exp = [{'field': 'a', 'order_by': 'asc'}, {'field': 'c', 'order_by': 'desc'}, {'field': 'd', 'order_by': 'asc'}]
    expect(defaultOrderBy).toMatchObject(exp)
})

test('default filter', () => {
    let grid = [
        { 'field': 'a', 'defaultFilter': {'value': 'a1'}},
        { 'field': 'b', 'defaultFilter': {'value': 'b1'}},
        { 'field': 'c', 'defaultFilter': {'value': 'c1'}}
    ]
    //defaultFitler: {'value': 'string/bool/', 'type': '', 'key': '', 'field': ''}
    let defaultFilter = []
    let x = new cdef({},{}, {})
    x.DefaultFilter(grid[0], defaultFilter)
    x.DefaultFilter(grid[1], defaultFilter)
    x.DefaultFilter(grid[2], defaultFilter)
    let exp = [ {'value': 'a1', 'field': 'a'}, {'value': 'b1', 'field': 'b'}, {'value': 'c1', 'field': 'c'} ]
    expect(defaultFilter).toMatchObject(exp)
})


test('enforced and default filter', () => {
    
})


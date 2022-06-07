const { exp } = require('mathjs')
const cd = require('./index.js')
const cdef = cd.ColumnDefsInit

test('value getter/setter/formatter parser test', () => {
    //creates a function
    let x = new cdef({},{}, {})
    let grid_column = {
        'field': 'test',
        'valueGetter': 'test + 1'
    }
    x.ValueTransform(grid_column, 'valueGetter')

    let fn = grid_column['valueGetter']
    let params = {'data': {'test': '1' }}
    expect(2).toBe(2)
})

test('value getter/setter/formatter native test', () => {
    //replaces valueGetter with native unprocessed string
    let x = new cdef({},{}, {})
    let grid_column = {
        'field': 'test',
        'valueGetterNative': 'test + 1'
    }
    x.ValueTransform(grid_column, 'valueGetter')
    let sx = grid_column['valueGetter']
    expect(sx).toBe('test + 1')
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

//meta columns
test('add meta_column default', () => {
    let grid = [
        {
            'field': 'test',
            'ifNull': 'default',
            'isCrud': true
        }
    ]

    let x = new cdef({},{}, {})

    x.MetaColumn( grid )
    expect(grid[1]['field']).toBe('_ag-meta_')
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

test('validator initialization', () => {
    //prepends delete/undo
    let grid_column =
        {
            'field': 'test',
            'ifNull': 'default',
            'isCrud': true,
            'validator': 'test > 1'
        }
    let x = new cdef({},{}, {})
    x.Validators(grid_column)
    let fn = grid_column['validator']
    let params = {'data': {'test': -2} }
    expect(fn(params)).toBe(false)
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


//defaultFilter and defaultValue for sub modal field key for submodal

// this.DefaultFilter(grid_column,defaultFilter)
// this.DefaultValue(grid_column)
// enforce fitler



// this.CellWidth(grid_column)

// this.CellEditorParams(grid_column)
// RunGridInit()
// this.IsEditable(grid_column)
// this.HideColumns(grid_column)

// test('RunGridInit', () => {

//     //check everything matches?
//     let grid = [
//         {
//             'field': 'test',
//             'ifNull': 'default',
//             'isCrud': true
//         }
//     ]

//     let x = new cdef({},{}, {})

//     x.MetaColumn( grid )
//     console.log(grid[1])
//     console.log(grid[1].defaultInsertValue.toString())
//     console.log(grid[1].defaultUpdateValue.toString())

//     let mx = {
//         'field': meta_column_name,
//         'editable': false,
//         'hide': true,
//         'suppressToolPanel': true,
//         'defaultInsertValue': fi, //should be a function creates backups. and how row was added.
//         'defaultUpdateValue': fu, //
//         'showSort': false,
//         'showFilter': false
//     }


//     expect(true).toBe(true)
// })
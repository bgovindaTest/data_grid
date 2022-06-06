const { exp } = require('mathjs')
const cd = require('./index.js')
const cdef = cd.ColumnDefsInit

// test('value getter/setter/formatter parser test', () => {
//     //creates a function
//     let x = new cdef({},{}, {})
//     let grid_column = {
//         'field': 'test',
//         'valueGetter': 'test + 1'
//     }
//     x.ValueTransform(grid_column, 'valueGetter')

//     let fn = grid_column['valueGetter']
//     let params = {'data': {'test': '1' }}
//     expect(2).toBe(2)
// })

// test('value getter/setter/formatter native test', () => {
//     //replaces valueGetter with native unprocessed string
//     let x = new cdef({},{}, {})
//     let grid_column = {
//         'field': 'test',
//         'valueGetterNative': 'test + 1'
//     }
//     x.ValueTransform(grid_column, 'valueGetter')
//     let sx = grid_column['valueGetter']
//     expect(sx).toBe('test + 1')
// })

// test('ifNull', () => {
//     let x = new cdef({},{}, {})
//     let grid_column = {
//         'field': 'test',
//         'ifNull': 'test + 1'
//     }
//     x.IfNull(grid_column)
//     let sx = grid_column['ifNull']
//     expect(sx).toBe('null')
// })

// test('ifNull default', () => {
//     let x = new cdef({},{}, {})
//     let grid_column = {
//         'field': 'test',
//         'ifNull': 'default'
//     }
//     x.IfNull(grid_column)
//     let sx = grid_column['ifNull']
//     console.log(sx)
//     expect(sx).toBe('default')
// })

//meta column
// test('add meta_column default', () => {
//     let grid = [
//         {
//             'field': 'test',
//             'ifNull': 'default',
//             'isCrud': true
//         }
//     ]

//     let x = new cdef({},{}, {})

//     x.MetaColumn( grid )
//     expect(grid[1]['field']).toBe('_ag-meta_')
// })

// test('initialize delete/undo button', () => {
//     //prepends delete/undo
//     let grid = [
//         {
//             'field': 'test',
//             'ifNull': 'default',
//             'isCrud': true
//         }
//     ]
//     let x = new cdef({},{}, {})
//     x.InitializeDeleteUndoColumn(grid)
//     // console.log(grid)
//     // console.log(grid[0]['cellEditorParams'])
//     expect(true).toBe(true)
// })

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
    let fn = grid_column['validator']
    let params = {'data': {'test': -2} }
    expect(fn(params)).toBe(false)
})


// this.CellClassRules(grid_column)



// this.CellEditorParams(grid_column)
// this.DefaultOrderBy(grid_column,defaultOrderBy)
// this.DefaultFilter(grid_column,defaultFilter)
// this.DefaultValue(grid_column)
// this.DefaultParameters(grid_column)
// this.CellWidth(grid_column)

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
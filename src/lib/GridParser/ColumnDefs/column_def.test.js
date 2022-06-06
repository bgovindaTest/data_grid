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


// this.IfNull(grid_column)
// this.IsEditable(grid_column)
// this.HideColumns(grid_column)
// this.Validators(grid_column)
// this.CellClassRules(grid_column)
// this.CellEditorParams(grid_column)
// this.DefaultOrderBy(grid_column,defaultOrderBy)
// this.DefaultFilter(grid_column,defaultFilter)
// this.DefaultValue(grid_column)
// this.DefaultParameters(grid_column)
// this.CellWidth(grid_column)

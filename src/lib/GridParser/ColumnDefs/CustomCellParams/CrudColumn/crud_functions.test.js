const cf = require('./crud_functions')

const DefaultParameters = require('../../DefaultParameters')
const ChmodParams  = require('../../../ChmodParams')
const ValueParser  = require('../../ValueParser')


function SetDefaults(grid) {
    let x = new DefaultParameters(grid)
    x.DefaultParamsInit()
    for(let i=0; i < grid.length; i++) {
        let grid_column = grid[i]
        let field       = grid_column['field']
        let tmp = null
        tmp = new ChmodParams(grid_column)
        tmp.ChmodParamsInit()
        tmp = new ValueParser(grid_column, {}) //{} is for depricated globals object
        tmp.ValueParserInit()
        // let gridColumnValuesObject = this.valuesObject[field] || []
        // tmp = new CustomCellParams(grid_column, gridColumnValuesObject)
        // CellClassRulesInit(grid_column)
    }
}


/*
check validation returns boolean or null
check null type casting still works. check if 
addition works with string alt value and number type alt value.

check lookups
check requiredFields
*/

test('insert new row function', () => {
    let x = new cf()
    let defaultValues = {'colA': {'value': 'a', 'dataType': '', 'key': '', ifNullSet: false, 'useKey': false }, 
        'colb': {'value': 'b', 'dataType': '', 'key': '', ifNullSet: false, 'useKey': false } }
    let f = x.InsertRowInit(defaultValues)
    let rowData = f()
    let exp = {colA: 'a', colb: 'b', '_ag-meta_': { crudType: 'insert', is_delete: false,
        backup: { colA: 'a', colb: 'b' } }
    }
    expect(rowData).toMatchObject(exp)
})

test('update row function', () => {
    let x = new cf()
    let rowData = {'a':1, 'b': 2}
    let f = x.UpdateRowInit()
    f(rowData)
    let exp = { a: 1, b: 2,
        '_ag-meta_': { crudType: 'update', is_delete: false, backup: { a: 1, b: 2 } }
    }
    expect(rowData).toMatchObject(exp)
})

test('undo row function', () => {
    let x = new cf()
    let rowData = { a: 4, b: 'd',
        '_ag-meta_': { crudType: 'update', is_delete: false, backup: { a: 1, b: 2 } }
    }
    let f = x.UndoRow()
    f(rowData)
    let exp = { a: 1, b: 2,
        '_ag-meta_': { crudType: 'update', is_delete: false, backup: { a: 1, b: 2 } }
    }
    expect(rowData).toMatchObject(exp)
})

test('delete row function', () => {
    let x = new cf()
    let rowData = { a: 1, '_ag-meta_': { crudType: 'update', is_delete: false, backup: { a: 1} } }
    let f = x.DeleteRow()
    f(rowData)
    let exp = { a: 1,'_ag-meta_': { crudType: 'update', is_delete: true, backup: { a: 1 } } }
    expect(rowData).toMatchObject(exp)
} )

test('undo delete row function', () => {
    let x = new cf()
    let rowData = { a: 1, '_ag-meta_': { crudType: 'update', is_delete: true, backup: { a: 1} } }
    let f = x.DeleteUndoRow()
    f(rowData)
    let exp = { a: 1,'_ag-meta_': { crudType: 'update', is_delete: false, backup: { a: 1 } } }
    expect(rowData).toMatchObject(exp)
} )

test('is row changed', () => {
    let x = new cf()
    let grid = [
        {'field': 'a', 'editable': true, 'defaultFilter': true, 'showFilter': false},
        // {'field': 'b', 'editable': true, 'defaultFilter': 'a',  'showFilter':  true},
        // {'field': 'c', 'editable': true, 'defaultFilter': {'value': 'a', 'value2': 'b', 'operator': 'between'},  'showFilter':  true}
    ]
    SetDefaults(grid)
    x.ExtractCrudConditions(grid)
    let change = x.IsRowChanged()
    let rowData = { a: 1, '_ag-meta_': { crudType: 'update', is_delete: true, backup: { a: 1} } }
    let no_change = change (rowData ) 
    rowData['a'] = 4
    let is_change = change(rowData)
    expect(is_change && ! no_change).toBe(true)
} )

test('is row complete', () => {
    let x = new cf()
    let grid = [
        {'field': 'a', 'editable': true, 'isRequired': true},
        {'field': 'b', 'editable': true, 'isRequired': false}
    ]
    SetDefaults(grid)
    x.ExtractCrudConditions(grid)
    let comp = x.IsRowComplete()
    let rowData = { a: 1, b: null,  '_ag-meta_': { crudType: 'update', is_delete: true, backup: { a: 1, b: null} } }
    let cx1 = comp (rowData ) //true 
    rowData['a'] = null
    let cx2 = comp(rowData) //false
    console.log(cx1, cx2)
    expect(cx1 && ! cx2).toBe(true)
} )

test('is row empty', () => {
    let x = new cf()
    let grid = [
        {'field': 'a', 'editable': true, 'isRequired': true},
        {'field': 'b', 'editable': true, 'isRequired': false}
    ]
    SetDefaults(grid)
    x.ExtractCrudConditions(grid)
    let fx = x.IsRowEmpty()
    let rowData = { a: null, b: null,  '_ag-meta_': { crudType: 'update', is_delete: true, backup: { a: 1, b: null} } }
    let cx1 = fx (rowData ) //true
    rowData['a'] = 1
    let cx2 = fx(rowData) //false
    expect(cx1 && ! cx2).toBe(true)
} )

test('is row deleted', () => {
    let x = new cf()
    let grid = [
        {'field': 'a', 'editable': true, 'isRequired': true},
        {'field': 'b', 'editable': true, 'isRequired': false}
    ]
    SetDefaults(grid)
    x.ExtractCrudConditions(grid)
    let fx = x.IsRowDeleted()
    let rowData = { a: null, b: null,  '_ag-meta_': { crudType: 'update', is_delete: true, backup: { a: 1, b: null} } }
    let cx1 = fx (rowData ) //true
    rowData['_ag-meta_']['is_delete'] = false
    let cx2 = fx(rowData) //false
    expect(cx1 && ! cx2).toBe(true)
} )

test('is row warning', () => {
    let x = new cf()
    let grid = [
        {'field': 'a', 'editable': true, 'ignoreError': true, 'validator': 'a > 1'},
    ]
    SetDefaults(grid)
    x.ExtractCrudConditions(grid)
    let fx = x.IsRowWarning()
    let rowData = { a: 2, '_ag-meta_': { crudType: 'update', is_delete: true, backup: { a: 1} } }
    let cx1 = fx (rowData ) //false
    rowData['a'] = 0
    let cx2 = fx (rowData ) //true
    expect(!cx1 && cx2).toBe(true)
} )

test('is row error', () => {
    let x = new cf()
    let grid = [
        {'field': 'a', 'editable': true, 'ignoreError': false, 'validator': 'a > 1'},
    ]
    SetDefaults(grid)
    x.ExtractCrudConditions(grid)
    let fx = x.IsRowError()
    let rowData = { a: 2, '_ag-meta_': { crudType: 'update', is_delete: true, backup: { a: 1} } }
    let cx1 = fx (rowData ) //false
    rowData['a'] = 0
    let cx2 = fx (rowData ) //true
    expect(!cx1 && cx2).toBe(true)
} )

test('crud type', () => {
    let x = new cf()
    let grid = [
        {'field': 'a', 'editable': true, 'ignoreError': false, 'validator': 'a > 1'},
    ]
    SetDefaults(grid)
    x.ExtractCrudConditions(grid)
    let fx = x.CrudType()
    let rowData = { a: 2, '_ag-meta_': { crudType: 'update', is_delete: true, backup: { a: 1} } }
    let cx1 = fx (rowData )

    expect(cx1 === 'update').toBe(true)
} )

test('crud status', () => {
    let x = new cf()
    let grid = [
        {'field': 'a', 'editable': true, 'ignoreError': false, 'validator': 'a > 1'},
        {'field': 'b', 'editable': true, 'ignoreError': true, 'validator': 'b == 0'}
    ]
    SetDefaults(grid)
    x.ExtractCrudConditions(grid)
    let fx = x.CrudStatus()
    let rowData = { a: 2, b:0, '_ag-meta_': { crudType: 'update', is_delete: false, backup: { a: 1, b: 0} } }
    let cx1 = fx (rowData )
    rowData['a'] = 0
    rowData['b'] = 1
    let cx2 = fx (rowData )
    let res2 =  {
        crudType: 'update',
        is_complete: true,
        is_error: true,
        is_save: false,
        is_warning: true,
        is_delete: false,
        is_empty: false,
        is_changed: true
    }
    expect(res2).toMatchObject(cx2)
} )



// CrudStatus()
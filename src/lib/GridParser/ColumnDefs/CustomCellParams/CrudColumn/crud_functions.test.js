const cf = require('./crud_functions')

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



    //ExtractCrudConditions(grid)
    let rowData = { a: 1, '_ag-meta_': { crudType: 'update', is_delete: true, backup: { a: 1} } }
    let f = x.IsRowChanged()
    let is_not_change = f(rowData)
    rowData['a'] = 4
    let is_change = f(rowData)
    expect(is_change && ! is_not_changed).toBe(true)
} )


// ExtractCrudConditions(grid)

// //before crud operations.
// IsRowChanged()
// IsRowComplete() 
// IsRowEmpty() 
// IsRowDeleted()
// IsRowWarning()
// IsRowError()
// CrudType()
// CrudStatus()
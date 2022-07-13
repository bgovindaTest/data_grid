const cp = require('./index')

/*
check validation returns boolean or null
check null type casting still works. check if 
addition works with string alt value and number type alt value.

check lookups
check requiredFields
*/

test('crud defaults editable', () => {
    let grid_column = {'field': 'A', 'editable': true}
    let x = new cp(grid_column)
    x.ChmodParamsInit()
    let crud_params = grid_column['chmodParams']
    let exp = { isPull: true, isPush: true, isChange: true }

    expect(crud_params).toMatchObject(exp)
})

test('crud rw', () => {
    let grid_column = {'field': 'A', 'editable': false, 'chmodParams': 'rw' }
    let x = new cp(grid_column)
    x.ChmodParamsInit()
    let crud_params = grid_column['chmodParams']
    let exp = { isPull: true, isPush: true, isChange: false }
    expect(crud_params).toMatchObject(exp)
})

test('crud object', () => {
    let grid_column = {'field': 'A', 'editable': true, 'chmodParams': {'isChange': true, 'isPull': false, 'isPush': false} }
    let x = new cp(grid_column)
    x.ChmodParamsInit()
    let crud_params = grid_column['chmodParams']
    let exp = { isPull: false, isPush: false, isChange: true }
    expect(crud_params).toMatchObject(exp)
})

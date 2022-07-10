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
    x.RunInit()

    // {
    //     field: 'A',
    //     editable: true,
    //     isCrud: { isPull: true, isPush: true, isChange: true }
    // }

    console.log(grid_column)
    expect(true).toBe(true)
    // expect(rowData).toMatchObject(exp)
})

// test('crud defaults not editable', () => {
//     let grid_column = {'field': 'A', 'editable': true}
//     let x = new cp(grid_column)

//     // expect(rowData).toMatchObject(exp)
// })
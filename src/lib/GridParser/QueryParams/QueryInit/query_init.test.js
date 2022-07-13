/*



*/

const qp = require('./index.js')

function SetDefaults(grid) {
    for (let i =0; i< grid.length; i++) {
        let grid_column = grid[0]
        if (!grid_column.hasOwnProperty('headerName') ) {grid_column['headerName'] = grid_column['field'].toUpperCase()}
        if (!grid_column.hasOwnProperty('dataType')   ) {grid_column['dataType']   = 'text'}
    }
}


test('import query_init', () => {
    expect(true).toBe(true)
})


// test('import query_init', () => {
//     let grid = [{'field': 'A', 'editable': true}]
//     SetDefaults(grid)
//     let x = new qp(grid)
//     let y =x.QueryParamsInit()
//     console.log(grid)
//     console.log(y)
//     expect(true).toBe(true)
//     // expect(crud_params).toMatchObject(exp)
// })

test('filter assembly', () => {
    let grid = [{'field': 'a', 'editable': true, 'defaultFilter': true, 'showFilter': false}]
    SetDefaults(grid)
    let x = new qp(grid)
    let y =x.QueryParamsInit()
    // console.log(y['filterParams']['current'])
    // console.log(y['filterParams']['filterList'])
    // console.log(y['filterParams']['enforcedFilters'])
    expect(true).toBe(true)
    // expect(crud_params).toMatchObject(exp)
})

// test('sort assembly', () => {
//     let grid = [{'field': 'A', 'editable': true, 'defaultFilter': true}]
//     SetDefaults(grid)
//     let x = new qp(grid)
//     let y =x.QueryParamsInit()
//     console.log(y['filterParams']['current'])
//     console.log(y['filterParams']['filterList'])
//     expect(true).toBe(true)
//     // expect(crud_params).toMatchObject(exp)
// })

// test('filter assembly', () => {
//     let grid = [{'field': 'A', 'editable': true, 'defaultFilter': true}]
//     SetDefaults(grid)
//     let x = new qp(grid)
//     let y =x.QueryParamsInit()
//     console.log(y['filterParams']['current'])
//     console.log(y['filterParams']['filterList'])
//     expect(true).toBe(true)
//     // expect(crud_params).toMatchObject(exp)
// })

// test('sort assembly', () => {
//     let grid = [{'field': 'A', 'editable': true, 'defaultFilter': true}]
//     SetDefaults(grid)
//     let x = new qp(grid)
//     let y =x.QueryParamsInit()
//     console.log(y['filterParams']['current'])
//     console.log(y['filterParams']['filterList'])
//     expect(true).toBe(true)
//     // expect(crud_params).toMatchObject(exp)
// })
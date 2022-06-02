const ex = require('./index.js')

// gridObjects: {
//     '__init_params__':  { },
//     '__url_params__': { },
//     '__default_values__': { },
//     '__drop_downs__': {},

//     //first grid if main doesnt exists
//     //others are subgrid to be called
//     'grids': {
//         'main': AgGridColumnDef + stuff_configurations (for headers?),
//         'xyz': AgGridColumnDef,
//     }
// }


test('load module', () => { expect(true).toBe(true) })

test('create and evaluate function', () => {
    let expr = '1+x+global_x'
    let data = {'x':1}
    let globals = {'global_x': 1}
    let fn =   ex.CreateFunction(expr)
    let res = ex.EvaluateFunction(fn, data, globals)
    expect(res).toBe(3)
})


class ColumnDefsInit {
    //for main loader
    //grid is json object for aggrid
    constructor(grid, pageParams, rowParams) {
        this.grid  = grid
        this.globals   = pageParams.globals || {}
        this.dropDowns = pageParams.dropDowns || {}
        this.urlParams = pageParams.urlParams || {}
        this.rowParams = rowParams
}
}
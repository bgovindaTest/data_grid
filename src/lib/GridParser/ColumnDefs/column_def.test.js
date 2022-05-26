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
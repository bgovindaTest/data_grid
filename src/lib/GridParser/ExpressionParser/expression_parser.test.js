const ex = require('./index.js')

test('load module', () => { expect(true).toBe(true) })

test('create and evaluate function', () => {
    let expr = '1+x+global_x'
    let data = {'x':1}
    let params = {'data': data}
    let globals = {'global_x': 1}
    let fn =   ex.CreateFunction(expr)
    let res = ex.EvaluateFunction(fn, params, globals)
    expect(res).toBe(3)
})
const ex = require('./index.js')

/*
check validation returns boolean or null
check null type casting still works. check if 
addition works with string alt value and number type alt value.

check lookups
check requiredFields
*/

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

//null and requires casting
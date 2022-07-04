const ex = require('./index.js')

/*
check validation returns boolean or null
check null type casting still works. check if 
addition works with string alt value and number type alt value.

check lookups
check requiredFields
*/

test('create and evaluate function', () => {
    let expr = '1+x+global_x'
    let data = {'x':1}
    let params = {'data': data}
    let globals = {'global_x': 1}
    let requiredFields = []
    let fn =   ex.CreateFunction(expr)
    let res = ex.EvaluateFunction(fn, params, globals, requiredFields)
    expect(res).toBe(3)
})

test('evaluate validation function true', () => {
    let expr = '0 <= 1+x < 2'
    let data = {'x':'0.5'}
    let params = {'data': data}
    let globals = {}
    let fn =   ex.CreateFunction(expr)
    let res = ex.EvaluateFunction(fn, params, globals, [])
    expect(res).toBe(true)
})

test('evaluate validation function false', () => {
    let expr = '0 <= 1+x < 2'
    let data = {'x':'1.5'}
    let params = {'data': data}
    let globals = {}
    let fn =   ex.CreateFunction(expr)
    let res = ex.EvaluateFunction(fn, params, globals, [])
    expect(res).toBe(false)
})

test('missing requiredField', () => {
    let expr = '0 <= 1+x+y < 2'
    let data = {'x':'1.5','y': null}
    let params = {'data': data}
    let globals = {}
    let fn =   ex.CreateFunction(expr)
    let res = ex.EvaluateFunction(fn, params, globals, ['y'])
    expect(res).toBe(null)
})

test('if null replace', () => {
    let expr = '1+x+ifnull(y,-1)'
    let data = {'x':'1','y': null}
    let params = {'data': data}
    let globals = {}
    let fn  = ex.CreateFunction(expr)
    let res = ex.EvaluateFunction(fn, params, globals, [])
    expect(res).toBe(1)
})

test('nullcast ', () => {
    let expr = '1+x+nullcast(y,"int")'
    let data = {'x':'1','y': null}
    let params = {'data': data}
    let globals = {}
    let fn  = ex.CreateFunction(expr)
    let res = ex.EvaluateFunction(fn, params, globals, [])
    expect(res).toBe(2)
})

test('create aggrid function ', () => {
    let expr = 'lookup(x,"y")'
    let data = {'x':{"y":'hi'} }
    let params = {'data': data}
    let globals = {}
    let fn  = ex.CreateAggridFunction( expr, globals, {} )
    let res = fn(params)
    expect(res).toBe('hi')
})

test('required fields', () => {

    //GridColumnRequiredFields(grid_column)

})
const vp = require('./index.js')
const ValueParser = vp['ValueParser']

function gc(options) {
    let grid_column = {'field': 'colA'}
    let keys = Object.keys(options)
    for (let i =0; i<keys.length; i++) {
        grid_column[keys[i]] = options[keys[i]]
    }  
    return grid_column
}

test('values getter', () => {
    let options = {'valueGetter': 'colA +1', 'valueSetter': {'useDefault':true} }
    let grid_column = gc(options)
    let x = new ValueParser(grid_column, {})
    x.RunInit()
    expect(grid_column.hasOwnProperty('valueSetter')).toBe(false)
})

test('values getter', () => {
    let options = {'valueGetter': 'ifnull( colA, 0) +1', 'validator': ' 0 < ifnull(colA,0) < 2'  , 'dataType': 'real', 'editable': true }
    let grid_column = gc(options)
    let vpx = new ValueParser(grid_column, {})
    vpx.RunInit()
    let fx = grid_column['valueGetter']
    let fv = grid_column['validator']
    let fs = grid_column['valueSetter']
    let params = {'data':{'colA': '5'}}
    let x = fx(params)
    let y = fv(params)
    let params2 =  {'data':{'colA': '5'}, 'newValue': '23.1.2'}
    fs(params2)
    let z = null
    let res = x === 6 && y === false && params2.data.colA === z
    expect(res).toBe(true)
})

//datetime
test('values date', () => {
    let options = {'dataType': 'date', 'editable': true }
    let grid_column = gc(options)
    let vpx = new ValueParser(grid_column, {})
    vpx.RunInit()
    let fs = grid_column['valueSetter']
    let p1 = {'data':{'colA': null}, 'newValue': '5/5/2021'}
    let p2 = {'data':{'colA': null}, 'newValue': '25/5/2021'}
    let p3 = {'data':{'colA': null}, 'newValue': '2021-01-01'}
    let p4 = {'data':{'colA': null}, 'newValue': 'abcd'}
    fs(p1); fs(p2); fs(p3); fs(p4);
    let res = p1.data.colA === '2021-05-05' && p2.data.colA === null
        && p3.data.colA === '2021-01-01' && p4.data.colA === null  
    expect(res).toBe(true)
})

test('values time', () => {
    let options = {'dataType': 'time', 'editable': true }
    let grid_column = gc(options)
    let vpx = new ValueParser(grid_column, {})
    vpx.RunInit()
    let fs = grid_column['valueSetter']
    let p1 = {'data':{'colA': null}, 'newValue': '5:5'}
    let p2 = {'data':{'colA': null}, 'newValue': '1:1:1'}
    let p3 = {'data':{'colA': null}, 'newValue': 'x'}
    fs(p1); fs(p2); fs(p3);
    let res = p1.data.colA === '05:05:00' && p2.data.colA === '01:01:01'
        && p3.data.colA === null
    expect(res).toBe(true)
})

//valueGetter required field
test('valuesGetter required field', () => {
    let options = {'valueGetter': 'ifnull( colA, 0) +1', 'dataType': 'real', 'valueGetterRequiredFields': ['colA'] }
    let grid_column = gc(options)
    let vpx = new ValueParser(grid_column, {})
    vpx.RunInit()
    let fx = grid_column['valueGetter']
    let p1 = {'data':{'colA': null}}
    let p2 = {'data':{'colA': '1'}}
    let x = fx(p1)
    let y = fx(p2)
    let res = x === null && y === 2
    expect(res).toBe(true)
})

// //validator required field
test('validator requiredField', () => {
    let options = {'validator': ' 0 < ifnull(colA,0) < 2'  , 'dataType': 'real', 'validatorRequiredFields': ['colA'] }
    let grid_column = gc(options)
    let vpx = new ValueParser(grid_column, {})
    vpx.RunInit()
    let fv = grid_column['validator']
    let p1 = {'data':{'colA': '5'}}
    let p2 = {'data':{'colA': '1'}}
    let p3 = {'data':{'colA': null}}
    let x = fv(p1)
    let y = fv(p2)
    let z = fv(p3)
    let res = x === false && y === true && null === z
    expect(res).toBe(true)
})

// //required field


// select colA, 0 < ifnull(colA,0) + colB < 2 as validator from x

test('values getter and validator requireField', () => {
    let options = {'valueGetter': 'ifnull( colA, 0) +1', 'validator': ' 0 < ifnull(colA,0) + colB < 2'  , 'dataType': 'real', 
        'requiredFields': ['colA'], 'validatorRequiredFields': ['colA', 'colB'] }
    let grid_column = gc(options)
    let vpx = new ValueParser(grid_column, {})
    vpx.RunInit()
    let fx = grid_column['valueGetter']
    let fv = grid_column['validator']
    let p1 = {'data':{'colA': '0', 'colB': null}}
    let p2 = {'data':{'colA': '0', 'colB': '1'}}
    let x = fx(p1)
    let y = fv(p1)
    let z = fv(p2)
    let res = x === 1 && y === null && true === z
    expect(res).toBe(true)
})
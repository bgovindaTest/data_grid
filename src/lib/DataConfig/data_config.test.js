const dc = require('./index.js')

function Keys(x) {
    return Object.keys(x)
}

//ignore console.error
beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
});

test('data_config import test', () => {
    //creates a function

    // console.log(dc['number_types'] )
    // console.log(dc['serial_types'] )
    // console.log(dc['text_types']   )
    // console.log(dc['date_types']   )
    // console.log(dc['object_types'] )

    // console.log(dc['null_conversion']   )
    // console.log(dc['data_classes']   )
    // console.log(dc['data_types'] )
    expect(true).toBe(true)
})

test('operator aliases', () => {
    //creates a function

    let values = {'=': 'Equals', '!=': 'Not Equals'}
    let expected = []
    let results  = []
    let keys   = Keys(values)
    for (let i = 0; i < keys.length ; i++) {
        let key = keys[i]
        expected.push(values[key])
        results.push( dc.ReturnOperatorAlias(key)  )
    }

    expect(results).toMatchObject(expected)
})

test('data classes', () => {
    let values = {'integer': 'number', 'float': 'number', 'serial': 'number',
        'text': 'text', 'datetime': 'date', 'array': 'array', 'object': 'object'}
    let keys   = Keys(values)
    let expected = []
    let results  = []
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i]
        expected.push(values[key])
        results.push( dc.ReturnDataClass(key)  )
    }
    expect(results).toMatchObject(expected)
})

test('default operator', () => {
    //creates a function
    let ch  = dc.DefaultOperator('char')
    let num = dc.DefaultOperator('integer')
    let res = ch === 'ilike' && num === '='
    expect(res).toBe(true)
})

test('grid column valid dtype', () => {
    //creates a function
    let is_valid = dc.GridColumnValidDtype('col1', 'int')
    let not_valid = dc.GridColumnValidDtype('col2', 'error_type')
    let res = is_valid && ! not_valid 
    expect(res).toBe(true)
})

test('grid column valid cell editor', () => {
    //creates a function
    let is_valid1  = dc.GridColumnValidCellEditor('col1', 'autoComplete')
    let is_valid2  = dc.GridColumnValidCellEditor('col2', 'agTextCellEditor')
    let not_valid  = dc.GridColumnValidCellEditor('col3', 'error_example')
    let res = is_valid1 && is_valid2 && ! not_valid 
    expect(res).toBe(true)
})
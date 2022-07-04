const dc = require('./index.js')

test('data_config import test', () => {
    //creates a function

    console.log(dc['number_types'] )
    console.log(dc['serial_types'] )
    console.log(dc['text_types']   )
    console.log(dc['date_types']   )
    console.log(dc['object_types'] )

    console.log(dc['null_conversion']   )
    console.log(dc['data_classes']   )
    console.log(dc['data_types'] )

    expect(true).toBe(true)
})

test('operator aliases', () => {
    //creates a function
    dc.ReturnOperatorAlias(operator_name)
    expect(true).toBe(true)
})

test('data classes', () => {
    //creates a function
    dc.ReturnDataClass(data_type_name)
    expect(true).toBe(true)
})

test('default operator', () => {
    //creates a function
    dc.DefaultOperator(data_type_name)
    expect(true).toBe(true)
})

test('grid column valid dtype', () => {
    //creates a function
    dc.GridColumnValidDtype(field, data_type)
    expect(true).toBe(true)
})

test('grid column valid cell editor', () => {
    //creates a function
    dc.GridColumnValidCellEditor(field, cellEditor)
    expect(true).toBe(true)
})
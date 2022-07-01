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
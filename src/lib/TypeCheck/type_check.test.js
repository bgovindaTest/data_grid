const tc = require('./index.js')

function Keys(x) {
    return Object.keys(x)
}

//ignore console.error
beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
});


test('data_config import test', () => {
    IsObject (x)
    expect(true).toBe(true)
})

// test('data_config import test', () => {
//     IsString (x)
//     expect(true).toBe(true)
// })

// test('data_config import test', () => {
//     IsInteger (x)
//     expect(true).toBe(true)
// })

// test('data_config import test', () => {
//     IsNull (x)
//     expect(true).toBe(true)
// })

// test('data_config import test', () => {
//     IsUndefined(x)
//     expect(true).toBe(true)
// })

// test('data_config import test', () => {
//     IsFunction(x)
//     expect(true).toBe(true)
// })

// test('data_config import test', () => {
//     IsNumber(x)
//     expect(true).toBe(true)
// })

// test('data_config import test', () => {
//     TextIsNumber(x)
//     expect(true).toBe(true)
// })

// test('data_config import test', () => {
//     IsArray(x)
//     expect(true).toBe(true)
// })

// test('data_config import test', () => {
//     IsBasicType(x)
//     expect(true).toBe(true)
// })

// test('data_config import test', () => {
//     IsBoolean(x)
//     expect(true).toBe(true)
// })

// test('data_config import test', () => {
//     IsDate(x)
//     expect(true).toBe(true)
// })

// test('data_config import test', () => {
//     IsTime(x)
//     expect(true).toBe(true)
// })

// test('data_config import test', () => {
//     IsDateTime(x)
//     expect(true).toBe(true)
// })

// test('data_config import test', () => {
//     TypeCastBoolean(bool_val)
//     expect(true).toBe(true)
// })

// test('data_config import test', () => {
//     TypeCastDateTime(bool_val)
//     expect(true).toBe(true)
// })

// test('data_config import test', () => {
//     TypeCastDate(date_val)
//     expect(true).toBe(true)
// })

// test('data_config import test', () => {
//     TypeCastTime(time_val)
//     expect(true).toBe(true)
// })

// test('data_config import test', () => {
//     TypeValid(val, data_type)
//     expect(true).toBe(true)
// })

// test('data_config import test', () => {
//     NullTypeCast( value, data_type  )
//     expect(true).toBe(true)
// })
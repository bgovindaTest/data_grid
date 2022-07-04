const tc = require('./index.js')

function Keys(x) {
    return Object.keys(x)
}

//ignore console.error
beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
});


// test('is object', () => {
//     let x = tc.IsObject({})
//     let y = tc.IsObject([])

//     expect(x && !y).toBe(true)
// })

// test('is string', () => {
//     let x = tc.IsString('x')
//     let y = tc.IsString(5)
//     expect(x && !y).toBe(true)
// })

// test('is integer', () => {
//     let x = tc.IsInteger(1)
//     let y = tc.IsInteger('2')
//     let z = tc.IsInteger('2.5')
//     let k = tc.IsInteger('abcd')
//     expect(x && y && !z && !k).toBe(true)
// })



// test('is null', () => {
//     let x = tc.IsNull(null)
//     let y = tc.IsNull()
//     expect(x && !y).toBe(true)
// })

// test('is undefined', () => {
//     let val = {}
//     let x = tc.IsUndefined(val['x'])
//     let y = tc.IsUndefined(val)
//     expect(x && !y).toBe(true)
// })

// test('is function', () => {
//     let x = tc.IsFunction( function() {})
//     let y = tc.IsFunction('a')
//     expect(x && !y).toBe(true)
// })

// test('is number', () => {
//     let x = tc.IsNumber(1)
//     let y = tc.IsNumber('2')
//     let z = tc.IsNumber('2.5')
//     let k = tc.IsNumber('abcd')
//     expect(x && y && z && !k).toBe(true)

// })

// test('text is number', () => {
//     let x = tc.TextIsNumber(1)
//     let y = tc.TextIsNumber('2')
//     let z = tc.TextIsNumber('2.5')
//     let k = tc.TextIsNumber('abcd')
//     expect(x && y && z && !k).toBe(true)
// })

// test('is array', () => {
//     let x = tc.IsArray([])
//     let y = tc.IsArray('a')
//     expect(x && !y).toBe(true)
// })

// test('is basic type', () => {
//     let x = tc.IsBasicType('a')
//     let y = tc.IsBasicType(1)
//     let z = tc.IsBasicType(true)
//     let k = tc.IsBasicType([])
//     expect(x && y && z && !k).toBe(true)
// })

// test('is boolean', () => {
//     let x = tc.IsBoolean('true')
//     let y = tc.IsBoolean(true)
//     let z = tc.IsBoolean('f')
//     let k = tc.IsBoolean([])
//     expect(x && y && z && !k).toBe(true)
// })

// test('is date', () => {
//     let x = tc.IsDate('2001-01-01')
//     let y = tc.IsDate('5/30/2005')
//     let z = tc.IsDate('05/3/2001')
//     let k = tc.IsDate('11')
//     expect(x && y && z && !k).toBe(true)
// })

// test('is time', () => {
//     let x = tc.IsTime('11:2:1')
//     let y = tc.IsTime('00:1:52')
//     let z = tc.IsTime('1:1')
//     let k = tc.IsTime('a')
//     expect(x && y && z && !k).toBe(true)
// })

test('is date time', () => {
    let x = tc.IsDateTime('2001-01-01  11:2:1')
    let y = tc.IsDateTime('00:1:52')
    let z = tc.IsDateTime('2001-01-01  11:22:10')
    let j = tc.IsDateTime('5/5/2001 01:1')
    let k = tc.IsDateTime('a')
    expect(x && !y && z && j && !k).toBe(true)
})




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
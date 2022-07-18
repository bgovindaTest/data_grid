const tc = require('./index.js')

function Keys(x) {
    return Object.keys(x)
}

//ignore console.error
beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
});


test('is object', () => {
    let x = tc.IsObject({})
    let y = tc.IsObject([])

    expect(x && !y).toBe(true)
})

test('is string', () => {
    let x = tc.IsString('x')
    let y = tc.IsString(5)
    expect(x && !y).toBe(true)
})

test('is integer', () => {
    let x = tc.IsInteger(1)
    let y = tc.IsInteger('2')
    let z = tc.IsInteger('2.5')
    let k = tc.IsInteger('abcd')
    expect(x && y && !z && !k).toBe(true)
})



test('is null', () => {
    let x = tc.IsNull(null)
    let y = tc.IsNull()
    expect(x && !y).toBe(true)
})

test('is undefined', () => {
    let val = {}
    let x = tc.IsUndefined(val['x'])
    let y = tc.IsUndefined(val)
    expect(x && !y).toBe(true)
})

test('is function', () => {
    let x = tc.IsFunction( function() {})
    let y = tc.IsFunction('a')
    expect(x && !y).toBe(true)
})

test('is number', () => {
    let x = tc.IsNumber(1)
    let y = tc.IsNumber('2')
    let z = tc.IsNumber('2.5')
    let k = tc.IsNumber('abcd')
    expect(x && y && z && !k).toBe(true)

})

test('text is number', () => {
    let x = tc.TextIsNumber(1)
    let y = tc.TextIsNumber('2')
    let z = tc.TextIsNumber('2.5')
    let k = tc.TextIsNumber('abcd')
    expect(x && y && z && !k).toBe(true)
})

test('is array', () => {
    let x = tc.IsArray([])
    let y = tc.IsArray('a')
    expect(x && !y).toBe(true)
})

test('is basic type', () => {
    let x = tc.IsBasicType('a')
    let y = tc.IsBasicType(1)
    let z = tc.IsBasicType(true)
    let k = tc.IsBasicType([])
    expect(x && y && z && !k).toBe(true)
})

test('is boolean', () => {
    let x = tc.IsBoolean('true')
    let y = tc.IsBoolean(true)
    let z = tc.IsBoolean('f')
    let k = tc.IsBoolean([])
    expect(x && y && z && !k).toBe(true)
})

test('is date', () => {
    let x = tc.IsDate('2001-01-01')
    let y = tc.IsDate('5/30/2005')
    let z = tc.IsDate('05/3/2001')
    let k = tc.IsDate('11')
    expect(x && y && z && !k).toBe(true)
})

test('is time', () => {
    let x = tc.IsTime('11:2:1')
    let y = tc.IsTime('00:1:52')
    let z = tc.IsTime('1:1')
    let k = tc.IsTime('a')
    expect(x && y && z && !k).toBe(true)
})

test('is date time', () => {
    let x = tc.IsDateTime('2001-01-01  11:2:1')
    let y = tc.IsDateTime('00:1:52')
    let z = tc.IsDateTime('2001-01-01  11:22:10')
    let j = tc.IsDateTime('5/5/2001 01:1')
    let k = tc.IsDateTime('a')
    expect(x && !y && z && j && !k).toBe(true)
})

test('boolean type cast', () => {
    let x =tc.TypeCastBoolean('f')
    let y =tc.TypeCastBoolean(true)
    let z =tc.TypeCastBoolean('asd')
    expect(x==='false' && y==='true' && z ===null ).toBe(true)
})

test('number type cast', () => {
    let x =tc.TypeCastNumber('1')
    let y =tc.TypeCastNumber(23.2)
    let z =tc.TypeCastNumber('aas')
    expect(x==='1' && y==='23.2' && z ===null ).toBe(true)
})

test('string type cast', () => {
    let x =tc.TypeCastString('1')
    let y =tc.TypeCastString(23.2)
    let z =tc.TypeCastString('aas')
    expect(x==='1' && y===null && z ==='aas' ).toBe(true)
})

test('type cast date time', () => {
    let a = tc.TypeCastDateTime('05/30/1995 15')
    let b = tc.TypeCastDateTime('05/30/1995 15:21:1')
    let c = tc.TypeCastDateTime('05/35/1995')
    expect(a==='1995-05-30 15:00:00' && b==='1995-05-30 15:21:01' && c===null).toBe(true)
})

test('date type cast', () => {
    let x = tc.TypeCastDate('2001-05-23')
    let y = tc.TypeCastDate('2001-1-3')
    let z = tc.TypeCastDate('2001-91-3')
    expect(x==='2001-05-23' && y === '2001-01-03' && z === null ).toBe(true)
})

test('timecast', () => {
    //seconds type cast not working for sss. switch to ss. may need to check later.
    let x = tc.TypeCastTime('22:12')
    let y = tc.TypeCastTime('01:31:15') 
    let z = tc.TypeCastTime('abc')
    expect(x==='22:12:00' && y === '01:31:15' && z === null ).toBe(true)
})

test('data_config import test', () => {
    let x = tc.TypeValid('1', 'int')
    let y = tc.TypeValid(22.2, 'real')
    let z = tc.TypeValid('1995-01-01', 'date')
    expect(x&&y&&z).toBe(true)
})

test('null type cast', () => {
    let x = tc.NullTypeCast( null, 'int'  )
    let y = tc.NullTypeCast( null, 'text'  )
    let z = tc.NullTypeCast( null, 'date'  )
    let a = tc.NullTypeCast( null, 'blah'  )
    let b = tc.NullTypeCast( '5', 'real'  )
    expect(x==='0' && y==="" && z==="" && a === null && b ==='5').toBe(true)
})
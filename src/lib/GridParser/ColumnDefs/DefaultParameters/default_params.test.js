/*
Test default parameter initialization
for main grid load and subgrid load
    subgrid load has access to main row data for
    setting defaults
*/
const dp = require('./index.js')




test('default params init default settings', () => {
    let grid = [ {'field': 'a'}, {'field': 'b', 'headerName': 'B'} ]
    let res = 
    [
        {
          field: 'a',
          defaultValue: { value: null, dataType: 'text', ifNullSet: false },
          isRequired: false,
          ignoreError: false,
          dataType: 'text',
          width: 200,
          editable: false,
          hide: false,
          headerName: 'a'
        },
        {
          field: 'b',
          headerName: 'B',
          defaultValue: { value: null, dataType: 'text', ifNullSet: false },
          isRequired: false,
          ignoreError: false,
          dataType: 'text',
          width: 200,
          editable: false,
          hide: false
        }
    ]
  
    let x = new dp(grid)
    x.DefaultParamsInit()
    expect(grid).toMatchObject(res)
})

//check subGrid
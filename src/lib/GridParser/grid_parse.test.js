const gp = require('./index.js')

test('gridParserTest', () => {


    const test_grid = [
        {'field': 'a', 'dataType': 'numeric',  'editable': true, 'defaultFilter': true, 'showFilter': false, 'showSort': true},
        {'field': 'b', 'editable': true, 'defaultValue': 'a'},
    ]

    let x = new gp(test_grid,[], 0)
    let grid = x.RunGridColumnsInit()
    console.log(grid)
    expect(true).toBe(true)

})

// test('subGridParserTest', () => {


//     const test_grid = [
//         {'field': 'a', 'editable': true, 'defaultFilter': true, 'showFilter': false, 'showSort': true},
//         {'field': 'b', 'editable': true, 'defaultFilter': 'a',  'showFilter':  true, 'showSort': true},
//       ]


//   let grid = lodashCloneDeep(test_grid)
//   let x = new gp(grid,[], 0)
//   let y =x.QueryParamsInit()

//   qmf.NewQuerySet,
//   expect(result).toMatchObject(expect_result)
// })

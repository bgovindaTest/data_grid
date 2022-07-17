// {'CustomEditor': CustomEditor, 'ReturnGridValuesObject': ReturnGridValuesObject}

// const data_config = require('../../../DataConfig')
// const DateTimeParams = require('./date_time')
// const AutoCompleteParams = require('./autocomplete_params')
// const LargeTextParams = require('./largeText')
// const AgRichParams = require('./agrich_params')
// const SubGrid      = require('./subgrid')

const DefaultParameters = require('../DefaultParameters')

// let grid = [
//     {'field': 'a', 'dataType': 'numeric',  'editable': true, 'defaultFilter': true, 'showFilter': false, 'showSort': true},
//     {'field': 'b', 'editable': true, 'defaultValue': 'a'},
//     {'field': 'c',  'valueGetter': 'a +1', 'validator': 'a + 1 > 0'}
// ]


test('no editor set', () => {
    let grid = [
        {'field': 'a', 'dataType': 'numeric',  'editable': true, 'defaultFilter': true, 'showFilter': false, 'showSort': true},
    ]
    let x = new DefaultParameters(grid)
    console.log(grid)
    x.DefaultParamsInit()
    expect(true).toBe(true)
})

test('no editor set', () => {
    let grid = [
        {'field': 'a', 'dataType': 'numeric',  'editable': true, 'defaultFilter': true, 'showFilter': false, 'showSort': true},
    ]
    let x = new DefaultParameters(grid)
    console.log(grid)
    x.DefaultParamsInit()
    expect(true).toBe(true)
})


//agrich params
//autococomplete
//date_time
//largeText
//links
//subGrid
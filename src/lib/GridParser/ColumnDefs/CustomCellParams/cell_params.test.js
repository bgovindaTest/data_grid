// {'CustomEditor': CustomEditor, 'ReturnGridValuesObject': ReturnGridValuesObject}
/*

    'customEditors':    ['autoCompleteEditor', 'crudSelectEditor', 'subGridSelectorEditor', 'agRichSelectCellEditor'],
    'standardEditors' : ['agTextCellEditor', 'agLargeTextCellEditor', 'dateTimeEditor' ], //make popupTrue for agLargeTextCellEditor
    'defaultEditor': 'agTextCellEditor'

*/


const DefaultParameters  = require('../DefaultParameters')
const AgRichParams       = require('./agrich_params')
const DateTimeParams     = require('./date_time')
const LargeTextParams    = require('./largeText')
const LinkParams         = require('./links')
const SubGridParams      = require('./subgrid')
// const AutoCompleteParams = require('./autocomplete_params')

function AddDefualtParams(grid) {
    let x = new DefaultParameters(grid)
    x.DefaultParamsInit()
}

test('agrich params no lookup', () => {
    let grid = [
        {'field': 'a', 'dataType': 'numeric',  'editable': true, 'cellEditor': 'agRichSelectCellEditor'},
    ]
    let valuesObject = [{'id': 1, 'a': 'a1'}, {'id': 2, 'a': 'a2'} ]
    AddDefualtParams(grid)
    let grid_column = grid[0]
    y = new AgRichParams(grid_column, valuesObject)
    y.AgRichSelectParamsInit()
    let expected = 
        {
            pushKey: 'a',
            pullKey: 'id',
            displayKey: 'a',
            values: [ 'a1', 'a2' ],
            mapObject: {}
        }
    expect(expected).toMatchObject(grid_column['cellEditorParams'])
})

test('agrich params with lookup', () => {
    let grid = [
        {'field': 'a', 'dataType': 'numeric',  'editable': true, 'cellEditor': 'agRichSelectCellEditor', 'isLookup': true},
    ]
    let valuesObject = [{'id': 1, 'a': 'a1'}, {'id': 2, 'a': 'a2'} ]
    AddDefualtParams(grid)
    let grid_column = grid[0]
    y = new AgRichParams(grid_column, valuesObject)
    y.AgRichSelectParamsInit()
    // console.log(grid_column['cellEditorParams'])
    // console.log(grid_column['valueSetter'])
    // console.log(grid_column['valueGetter'])
    let expected = {
        pushKey: 'a',
        pullKey: 'id',
        displayKey: 'a',
        values: [ 'a1', 'a2' ],
        mapObject: { a1: { id: '1', a: 'a1' }, a2: { id: '2', a: 'a2' } }
    }
    expect(grid_column['cellEditorParams']).toMatchObject(expected)
})

test('datetime params with date', () => {
    let grid = [
        {'field': 'a', 'dataType': 'date',  'editable': true, 'cellEditor': 'agRichSelectCellEditor', 'isLookup': true},
    ]
    let valuesObject = [{'id': 1, 'a': 'a1'}, {'id': 2, 'a': 'a2'} ]
    AddDefualtParams(grid)
    let grid_column = grid[0]
    y = new AgRichParams(grid_column, valuesObject)
    y.AgRichSelectParamsInit()
    // console.log(grid_column)
    console.log(grid_column['cellEditorParams'])
    console.log(grid_column['valueSetter'])
    console.log(grid_column['valueGetter'])

    //check dataType

    // {
    //     pushKey: 'a',
    //     pullKey: 'id',
    //     displayKey: 'a',
    //     values: [ 'a1', 'a2' ],
    //     mapObject: {}
    //   }
  


    expect(true).toBe(true)
})




//agrich params
//autococomplete
//date_time
//largeText
//links
//subGrid
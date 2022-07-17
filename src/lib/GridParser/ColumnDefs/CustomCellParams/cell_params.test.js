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
const AutoCompleteParams = require('./autocomplete_params')
const CustomCellParams   = require('./index')

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
        {'field': 'a', 'dataType': 'date',  'editable': true, 'cellEditor': 'dateTimeEditor', 'isLookup': true},
    ]
    AddDefualtParams(grid)
    let grid_column = grid[0]
    y = new DateTimeParams(grid_column)
    y.DateTimeInit()
    let expected = { allowInput: true, dateFormat: 'YYYY-MM-DD' }
    expect(grid_column['cellEditorParams']).toMatchObject(expected)
})

test('datetime params with datetime', () => {
    let grid = [
        {'field': 'a', 'dataType': 'datetime',  'editable': true, 'cellEditor': 'dateTimeEditor', 'isLookup': true},
    ]
    AddDefualtParams(grid)
    let grid_column = grid[0]
    y = new DateTimeParams(grid_column)
    y.DateTimeInit()
    let expected = { allowInput: true, dateFormat: 'YYYY-MM-DD HH:MM:SSS' }
    expect(grid_column['cellEditorParams']).toMatchObject(expected)
})

test('datetime params with time', () => {
    let grid = [
        {'field': 'a', 'dataType': 'time',  'editable': true, 'cellEditor': 'dateTimeEditor', 'isLookup': true},
    ]
    AddDefualtParams(grid)
    let grid_column = grid[0]
    y = new DateTimeParams(grid_column)
    y.DateTimeInit()
    let expected = {
        allowInput: true,
        dateFormat: 'HH:MM:SSS',
        enableTime: true,
        enableSeconds: true,
        noCalendar: true
    }
    expect(grid_column['cellEditorParams']).toMatchObject(expected)
})

test('largeText params', () => {
    let grid = [
        {'field': 'a', 'dataType': 'text',  'editable': true, 'cellEditor': 'agLargeTextCellEditor'},
    ]
    AddDefualtParams(grid)
    let grid_column = grid[0]
    y = new LargeTextParams(grid_column)
    y.LargeTextInit()
    let expected = { maxLength: 100, rows: 10, cols: 50 }
    expect(grid_column['cellEditorParams']).toMatchObject(expected)
})

test('links params', () => {
    let grid = [
        {'field': 'a', 'dataType': 'text',  'editable': true, 'cellEditor': 'agLargeTextCellEditor'},
    ]
    AddDefualtParams(grid)
    let grid_column = grid[0]
    y = new LinkParams(grid_column)
    y.LinkInit()
    let params = {'value': {'urlName': 'linkName', 'urlPath': 'linkPath'}}
    let res = grid_column['cellRenderer'](params)
    let expected = `<a href="linkPath" target="_blank" rel="noopener">'+ linkName+'</a>`
    expect(expected).toBe(res)
})

test('subgrid params', () => {
    let grid = [
        {'field': 'a', 'dataType': 'text',  'editable': true, 'cellEditor': 'subGridSelectorEditor',
        'cellEditorParams': {'subGridPos': 2}},
    ]
    AddDefualtParams(grid)
    let grid_column = grid[0]
    y = new SubGridParams(grid_column)
    y.SubGridParamsInit()
    let expected = { subGridPos: 2, pre_name: '', post_name: '', subGridName: 'a' }
    expect(grid_column['cellEditorParams']).toMatchObject(expected)
})

test('autocomplete params with lookup', () => {
    let grid = [
        {'field': 'a', 'dataType': 'text',  'editable': true, 'cellEditor': 'autoCompleteEditor'},
    ]
    let valuesObject = [{'id': 1, 'a': 'a1'}, {'id': 2, 'a': 'a2'} ]
    AddDefualtParams(grid)
    let grid_column = grid[0]
    y = new AutoCompleteParams(grid_column, valuesObject)
    y.AutoCompleteParamsInit()

    let expected =  {
        pushKey: 'a',
        pullKey: 'id',
        displayKey: 'a',
        columnDef: [ { field: 'id', width: 150 }, { field: 'a', width: 150 } ],
        values: [ { id: '1', a: 'a1' }, { id: '2', a: 'a2' } ],
        mapObject: { a1: { id: '1', a: 'a1' }, a2: { id: '2', a: 'a2' } }
    }
  
  

    expect(expected).toMatchObject(grid_column['cellEditorParams'])
})

test('main assembly runs', () => {
    let grid = [
        {'field': 'a', 'dataType': 'numeric',  'editable': true, 'cellEditor': 'agRichSelectCellEditor'},
        {'field': 'b', 'dataType': 'date',  'editable': true, 'cellEditor': 'dateTimeEditor', 'isLookup': true},
        {'field': 'c', 'dataType': 'text',  'editable': true, 'cellEditor': 'subGridSelectorEditor',
        'cellEditorParams': {'subGridPos': 2}},
        {'field': 'd', 'dataType': 'text',  'editable': true, 'cellEditor': 'autoCompleteEditor'},
    ]
    let valuesObject = [{'id': 1, 'd': 'a1'}, {'id': 2, 'd': 'a2'} ]
    AddDefualtParams(grid)
    for(let i=0; i < 3; i++) {
        let grid_column = grid[i]
        let y = new CustomCellParams(grid_column, [])
        y.CustomCellParamsInit()
    }
    let y = new CustomCellParams(grid[3], valuesObject)
    y.CustomCellParamsInit()
    // console.log(grid)
    expect(true).toBe(true)


})



//agrich params
//autococomplete
//date_time
//largeText
//links
//subGrid
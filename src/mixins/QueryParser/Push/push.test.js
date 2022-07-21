const gp = require('../../../lib/GridParser')
const rb = require('../ReqBodyHeaderParams')
const px = require('./index.js')




function ReturnColumnDefs() {
    let columnDefs = [
        {'field': 'a', 'editable': true, 'dataType': 'numeric'},
        {'field': 'b', 'editable': true, 'defaultValue': {'value': '21', 'dataType': 'numeric', 'ifNullSet': true}},
        {'field': 'c', 'chmodParams': 'w', 'valueGetter': 'a +1', 'validator': 'a + 1 > 0'},
        {'field': 'd', 'editable': true, 'cellEditor': 'autoCompleteEditor' },
    ]
    return columnDefs
}

function ReturnRowData() {
    let rowData = [
        {'a': '1', 'b': null, 'd': {'d': 'dvalue', 'id': 1}}
    ]
    return rowData
}

function ReturnCrudParams(columnDefs) {
    let crudParams = { 'default_route': 'localhost' }
    let x = new rb(crudParams, columnDefs)
    x.CrudParamsInit()

}







test('pushParams Init', () => {
    let columnDefs = ReturnColumnDefs()

    let x = new gp(columnDefs,{}, 0)
    let grid = x.RunGridColumnsInit()
    let pxv  = new px(grid['columnDef'])
    pxv.PushParamsInit()
    console.log(pxv)
    // pushFieldParams: [ 'a', 'b', 'c', 'd' ],
    // pushLookupParams: { d: { pullKey: 'id', pushKey: 'd' } },
    // pushValueGetters: { c: [Function: fn] }


    expect(true).toBe(true)
})

// let crudParams = ReturnCrudParams(columnDefs)

// class Push {
//     constructor(grid) {
//         this.grid             = grid
//         this.pushFieldParams  = []
//         this.pushLookupParams = {}
//         this.pushValueGetters = {}
//     }
//     PushParamsInit( ) {


// CreatePushPayload(reqBodyParams, uiCrudType, data )
// CrudType(rowData, reqBody)
// MapRowData(rowData, crudType, set_filters)
// CreateRowDataOut(rowData, reqBody)
// PushParamsInit( )
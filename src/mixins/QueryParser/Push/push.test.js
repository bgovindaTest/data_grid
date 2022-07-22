const gp = require('../../../lib/GridParser')
const rb = require('../ReqBodyHeaderParams')
const px = require('./index.js')




function ReturnColumnDefs() {
    let columnDefs = [
        {'field': 'a', 'editable': true, 'dataType': 'numeric'},
        {'field': 'b', 'editable': true, 'defaultValue': {'value': '21', 'dataType': 'numeric', 'ifNullSet': true}},
        {'field': 'c', 'chmodParams': 'w', 'valueGetter': 'a +1', 'validator': 'a + 1 > 0'},
        {'field': 'd', 'editable': true, 'cellEditor': 'autoCompleteEditor' },
        {'field': 'id', 'chmodParams': 'rw'},
    ]
    return columnDefs
}

function ReturnTableData() {
    let tableData = [
        {
            'a': '1', 'b': null, 'd': {'d': 'dvalue', 'id': '20'},  
            '_ag-meta_': {'crudType': 'insert', 'is_delete': false},
            'id': '-2'
        }
    ]
    return tableData
}

function ReturnCrudParams(columnDefs, set_filters) {
    let crudParams = { 'default_route': 'localhost', 'set_filters': set_filters }
    let x = new rb(crudParams, columnDefs)
    x.CrudParamsInit()
    return crudParams

}

// test('pushParams Init', () => {
//     let columnDefs = ReturnColumnDefs()

//     let x = new gp(columnDefs,{}, 0)
//     let grid = x.RunGridColumnsInit()
//     let pxv  = new px(grid['columnDef'])
//     pxv.PushParamsInit()
//     let res = {
//         pushFieldParams: [ 'a', 'b', 'c', 'd', 'id' ],
//         pushLookupParams: { d: { pullKey: 'id', pushKey: 'd' } },
//         pushValueGetters: true,
//         defaultValues: {'b': '21'}
//     }
//     let exp = {'pushFieldParams': pxv['pushFieldParams'],
//         'pushLookupParams': pxv['pushLookupParams'],
//         'pushValueGetters': typeof pxv['pushValueGetters']['c'] === 'function',
//         'defaultValues': pxv['defaultValues']
//     }
//     expect(exp).toMatchObject(res)
// })

// test('pushParams CreateRow', () => {
//     let columnDefs = ReturnColumnDefs()
//     let x = new gp(columnDefs,{}, 0)
//     let grid = x.RunGridColumnsInit()
//     let tableData = ReturnTableData()
//     let reqBody = ReturnCrudParams(grid['columnDef'], [])
//     let pxv  = new px(grid['columnDef'])
//     pxv.PushParamsInit()
//     let rowData = tableData[0]
//     let rd = pxv.CreateRowDataOut(rowData, reqBody)
//     let res = { a: '1', b: '21', c: 2, d: '20', id: '-2' }
//     expect(rd).toMatchObject(res)
// })

// test('pushParams CreateRow editable false', () => {
//     let columnDefs = ReturnColumnDefs()
//     columnDefs[0]['editable'] = false
//     columnDefs[2]['editable'] = false
//     let x = new gp(columnDefs,{}, 0)
//     let grid = x.RunGridColumnsInit()
//     let tableData = ReturnTableData()
//     let reqBody = ReturnCrudParams(grid['columnDef'], [])
//     let pxv  = new px(grid['columnDef'])
//     pxv.PushParamsInit()
//     let rowData = tableData[0]
//     let rd = pxv.CreateRowDataOut(rowData, reqBody)
//     let res = {  c: 2, d: -1, id: -1 }
//     expect(rd).toMatchObject(res)
// })


// test('pushParams update row a only', () => {
//     let columnDefs = ReturnColumnDefs()
//     let set_filters = ['a']
//     let x = new gp(columnDefs,{}, 0)
//     let grid = x.RunGridColumnsInit()
//     let tableData = ReturnTableData()
//     let reqBody = ReturnCrudParams(grid['columnDef'], set_filters)
//     // console.log(reqBody)
//     let pxv  = new px(grid['columnDef'])
//     pxv.PushParamsInit()
//     let rowData = tableData[0]
//     rowData['_ag-meta_']['crudType'] = 'update'
//     let rd = pxv.CreateRowDataOut(rowData, reqBody)
//     console.log(rd)
//     let res = { a: '1', id: '-1' }
//     // console.log(rowDa)
//     expect(rd).toMatchObject(res)
// })


// CreatePushPayload(reqBodyParams, uiCrudType, data )
// CrudType(rowData, reqBody)
// MapRowData(rowData, crudType, set_filters)
// CreateRowDataOut(rowData, reqBody)
// PushParamsInit( )
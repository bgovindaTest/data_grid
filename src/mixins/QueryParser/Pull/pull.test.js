const px = require('./index.js')
const gp = require('../../../lib/GridParser')

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

let columnDefs = ReturnColumnDefs()
let x = new gp(columnDefs,{}, 0)
let grid = x.RunGridColumnsInit()

test('pull Init', () => {
    expect(true).toBe(true)
})

// // this.pushFieldParams  = []
// // this.pushLookupParams = {}
// PullParamsInit( )
// QueryToRowData
// //create parameters for query
// NewQueryParams() 
// PreviousPageParams() 
// NextPageParams()  
// urlParams
// NewQuerySet()
// //pagination functions
// ChangePage(i)
// GetRouteParam
// OrderByObject()
// PaginationObject()
// //Functions below used for processing filter object.
// WhereObject()
// AppendFilterRow
// ArrayValueParse(filterRow) 
// BetweenValueParse
// // function TypeCheckFunction(data_type) {
// GetTypeCheckFunction
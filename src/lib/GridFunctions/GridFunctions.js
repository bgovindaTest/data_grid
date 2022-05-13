/*
The grid functions module has functions for user changes to the grid. 

Grid Function
redraw_rows: refresh UI of grid
remove_row_data: removes all rows from grid
append_rows: adds new rows to grid
new_sheet: creates an empty sheet.
undo: runs UndoRow on all selected rows.
UndoRow: Returns a given rows server fields to original values
Delete: runs SetDelete on all selected rows
SetDelete: sets __is_delete__ variable to (true/false) on a given row
insert: main insert function
InsertSelected: insert the number of rows highlighted
CreateNewRow: creates a new row. 
server_error_display:

Inputs:
gridOptions: Required by ag-grid contains api often set to gridApi
gridColumnApi: Required by ag-grid
gridParams:
rowData:

try: catch added to grid functions because range selection lingers and will try to return
rows that were selected before filter
*/

const field_functions    = require("@/library/app_functions/field_functions")

function redraw_rows(gridOptions) {
    //redraws all visible rows
    gridOptions.api.redrawRows()
    gridOptions.api.refreshCells()
}

function remove_row_data(rowData) {
    /*
    This function takes the rowData object and removes all rows without setting new object. This removes
    all rows without breaking linking to object throughout app

    rowData: main array for aggrid contains all table data
    */
    rowData.length = 0
}

function reset_all_row_data(gridOptions, rowData, server_fields) {

    for (let i=0; i<rowData.length; i++) {
        UndoRow (rowData[i], server_fields)
    }
    redraw_rows(gridOptions)
}

function append_rows(rowData, rows ) {
    /*
    This add new rows to the main rowData object in aggrid. Can accept and array of rows
    or just one json row.
    */
    if( Array.isArray(rows) ){
        for (let i = 0; i < rows.length; i++) {
            rowData.push(rows[i])
        }
    }
    else {
        rowData.push(rows)
    }
}

function append_rows_top(rowData, rows ) {
    /*
    This add new rows to the main rowData object in aggrid. Can accept and array of rows
    or just one json row.
    */
    if( Array.isArray(rows) ){
        for (let i = 0; i < rows.length; i++) {
            rowData.unshift(rows[i])
        }
    }
    else {
        rowData.unshift(rows)
    }
}


function new_sheet(gridOptions, rowData, pagination, new_input_params) {
    /*
    Get page limit size from pagination?
    //check if valid. If not get default 1k?
    */
    var pageSize = ReturnPageSize(pagination)
    var rows = []
    for (let i =0; i < pageSize; i++) {
        rows.push(CreateNewRow(new_input_params))
    }
    remove_row_data(rowData)
    append_rows(rowData, rows)
    redraw_rows(gridOptions)
}

function ReturnPageSize(pagination) {
    //Use page limit size from pagination to determine size of page.
    //For new sheet.
    var lx =parseInt(pagination['limit'] )
    if (isNaN(lx)) {return 1000} 
    if (lx < 10) { return 10}
    else if (lx > 5000) { return 5000}
    return lx

}

function undo(gridOptions, server_fields) {
    /*
    undo loops through all rows that have been highlighted when undo function is selected
    and runs UndoRow on them. This replaces the current values with those stored in the backup
    paramters.
    */
    try{
        var api = gridOptions.api
        var rangeSelection = api.getCellRanges()
        if (rangeSelection.length === 0) { return }
        rangeSelection = rangeSelection[0]
        var startRow = Math.min(rangeSelection.startRow.rowIndex, rangeSelection.endRow.rowIndex)
        var endRow = Math.max(rangeSelection.startRow.rowIndex, rangeSelection.endRow.rowIndex)
        var rowNodes = []
        for (var rowIndex = startRow; rowIndex <= endRow; rowIndex++) {
            var rowModel = api.getModel()
            var rowNode = rowModel.getRow(rowIndex)
            var rowx = rowNode.data
            UndoRow(rowx, server_fields)
            rowNodes.push(rowNode)
        }
        redraw_rows(gridOptions)
    } catch (err) {
        console.log("undo faild. lingering selection the likely cause after using view")
    }
}


function UndoRow (rowx, server_fields) {
    //set row data back to backup/original value
    SetBackup(rowx, server_fields)
    SetDelete(rowx, false)
}

function SetBackup (rowx, server_fields) {
    //returns all server fields to original values.
    for(var i = 0; i < server_fields.length; i++) {
        var key = server_fields[i]
        var backupKey = field_functions.BackupFieldName(key)
        rowx[key]  = rowx[backupKey]
    }
}


function Delete(gridOptions, bool_value) {
    //used to delete rows in add dat
    //check if allow delete.
    //button function
    // console.log('Delete function')
    try {
        var api = gridOptions.api
        var rangeSelection = api.getCellRanges()
        if (rangeSelection.length === 0) { return }
        rangeSelection = rangeSelection[0]
        var startRow = Math.min(rangeSelection.startRow.rowIndex, rangeSelection.endRow.rowIndex)
        var endRow = Math.max(rangeSelection.startRow.rowIndex, rangeSelection.endRow.rowIndex)
        var rowNodes = []
        for (var rowIndex = startRow; rowIndex <= endRow; rowIndex++) {
            var rowModel = api.getModel()
            var rowNode = rowModel.getRow(rowIndex)
            var rowx = rowNode.data
            //rowData['delete'] = "Delete"
            SetDelete(rowx, bool_value)
            rowNodes.push(rowNode)
        }
        api.redrawRows({'rowNodes': rowNodes})
    } catch (err) {
        console.log("delete failed. lingering selection the likely cause after using view")
    }
}

function SetDelete(rowx, bool_value) {
    //is delete changes allowed?
    //Need to check delete param. SetDelete, SetUnmodified and SetModified used to track which rows have been edited
    //This is used to determine if selecting an Edit/Add tab will be allowed b/c only one
    //Modification allowed at a time

    if ( rowx[field_functions.allow_delete ()] ) {
        rowx[field_functions.is_deleted()] = bool_value
    }
}




function insert(rowData, num_rows, gridOptions, new_input_params, add_top=false) {
    /*
    // check what happens to NodeId after insert?
    Refrences:
    // https://stackoverflow.com/questions/38505806/add-remove-rows-in-ag-grid/38949539
    // https://stackoverflow.com/questions/57463050/how-to-find-out-the-index-of-a-selected-row-of-a-ag-grid
    */
    var rows = []
    for (let i =0; i < num_rows ; i++) {
        rows.push(CreateNewRow(new_input_params))
    }
    if (add_top) {
        append_rows_top(rowData, rows )
    } else {
        append_rows(rowData, rows)
    }
    if (rows.length > 0) {
        redraw_rows(gridOptions)
    }

}

/*
Remove
const selectedRow = this.gridApi.getFocusedCell()
const id = this.gridOptions.rowData[selectedRow.rowIndex].i
this.gridOptions.rowData.splice(selectedRow.rowIndex, 1)
this.gridApi.setRowData(this.gridOptions.rowData)
*/

function InsertSelected(rowData, gridOptions, new_input_params) {
    //used to delete rows in add dat
    //check if allow delete.
    //button function
    var api = gridOptions.api
    var rangeSelection = api.getCellRanges()
    if (rangeSelection.length === 0) { return }
    rangeSelection = rangeSelection[0]
    var startRow = Math.min(rangeSelection.startRow.rowIndex, rangeSelection.endRow.rowIndex)
    var endRow = Math.max(rangeSelection.startRow.rowIndex, rangeSelection.endRow.rowIndex)
    var numNewRows = (endRow-startRow) +1
    insert(rowData, numNewRows, gridOptions, new_input_params, false)
}


function RemoveSelected(rowData, gridOptions) {
    //removes row from grid. Adds indicator to row which is then spliced out
    //check if allow delete.
    //button function
    try {
        var api = gridOptions.api
        var rangeSelection = api.getCellRanges()
        if (rangeSelection.length === 0) { return }
        rangeSelection = rangeSelection[0]
        var startRow = Math.min(rangeSelection.startRow.rowIndex, rangeSelection.endRow.rowIndex)
        var endRow = Math.max(rangeSelection.startRow.rowIndex, rangeSelection.endRow.rowIndex)
        for (var rowIndex = startRow; rowIndex <= endRow; rowIndex++) {
            var rowModel = api.getModel()
            var rowNode = rowModel.getRow(rowIndex)
            var rowx = rowNode.data
            rowx['__is_set_for_removal__'] = true
        }
        var i = 0;
        while (i < rowData.length) {
        if (rowData[i].hasOwnProperty('__is_set_for_removal__') ) {
            rowData.splice(i, 1);
        } else {
            ++i;
        }
        }
        redraw_rows(gridOptions)
    } catch (err) {
        console.log("remove failed. lingering selection the likely cause after using view")
    }

}


function CreateNewRow(new_input_params) {
    /*
    This creates a new row object. The intial default values are stored in gridParams['insert_row_params']
    */
    var new_row = {}
    for (let key in new_input_params) {
        new_row[key] = new_input_params[key]
    }
    return new_row
}

function server_error_display(gridOptions,is_error) {
    /*
    //used to hid show error
    //This function hides columns based on which tab is selected.
    //lastUpdatedBy shown on View and Edit Tab
    //status is only show for edit tab 
    */

    var gridColumnApi = gridOptions.columnApi
    gridColumnApi.setColumnVisible(field_functions.server_error(), is_error)
}

export default {
    'reset_all_row_data': reset_all_row_data,
    'redraw_rows':  redraw_rows,
    'remove_row_data': remove_row_data,
    'append_rows': append_rows,
    'new_sheet': new_sheet, 
    'undo': undo,
    'UndoRow': UndoRow,
    'Delete': Delete, 
    'SetDelete': SetDelete, 
    'insert': insert,
    'InsertSelected': InsertSelected,
    'RemoveSelected': RemoveSelected,
    'CreateNewRow': CreateNewRow,
    'server_error_display': server_error_display
}
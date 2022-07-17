//prepends delete/undo column to grid
const data_config = require('../../../../DataConfig')
const type_check = require('../../../../TypeCheck')
const meta_column_name = data_config['meta_column_name']


function CrudColumnInit(grid) {
    /*
    Used to add delete/undo button to grid. Handles intialization parameters if provided.
    Sets paramaters on when to show the delete/undo options.

    allways available and at beginning.

    data in rowData contains backup values and delete_status

    add allow copy
    */
    let du_column = {}
    let is_defined = false
    for(let i=0; i < grid.length; i++) {
        let grid_column = grid[i]
        if (grid_column['field'] === meta_column_name ) { //use cell editor?
            du_column  = grid_column
            is_defined = true
            break
        }
    }

    let defaultCellEditorParams = {
        "allowDelete": {'update': true,  'insert': false}, //shows delete for pulled data only (has precedence)
        "allowUndo":   {'update': true,  'insert': true}, //shows undo for insert and update  (has precedence)
        "allowCopy":   {'update': true,  'insert': true} //show + for copy row.
    }
    SetDefaults(du_column)
    if (!du_column.hasOwnProperty('cellEditorParams') ) { 
        du_column['cellEditorParams'] = defaultCellEditorParams
    }
    let cellEditorParams = du_column['cellEditorParams']
    SetParameters('allowDelete', cellEditorParams, defaultCellEditorParams)
    SetParameters('allowUndo', cellEditorParams, defaultCellEditorParams)
    SetParameters('allowCopy', cellEditorParams, defaultCellEditorParams)

    //always at beginning. maybe hidden though.
    if (! is_defined) {
        grid.unshift(du_column)
    }

}

function SetDefaults(grid_column) {
    let du_column = grid_column
    du_column['showSort']   = false
    du_column['showFilter'] = false

    //hide button if all false dont show
    if (du_column.hasOwnProperty('allowAction') ) { 
        if (du_column['allowAction'] === false) {
            du_column['hide'] = true
            du_column['suppressToolPanel'] = true //suppressToolPanel - removes it from the tool panel.
        }
    } else {
        du_column['allowAction'] = true
    }


    let headerName = 'GridAction'
    if (!du_column.hasOwnProperty('headerName') ) { du_column['headerName'] = headerName }        
    if (du_column.hasOwnProperty('cellEditor') ) { du_column['cellEditor'] = 'crudSelectEditor' } 

}

function SetParameters(actionName, cellEditorParams, defaultCellEditorParams ) {
    let duc = cellEditorParams
    if (duc.hasOwnProperty(actionName) ) {
        let ducx = duc[actionName]
        if (type_check.IsBoolean(ducx)) {
            if (ducx == true) { duc[actionName] = defaultCellEditorParams[actionName] } 
            else {duc[actionName] = SetFalse()}
        } else {
            if (! ducx.hasOwnProperty('update') ) {ducx['update'] = defaultCellEditorParams[actionName]['update'] }
            if (! ducx.hasOwnProperty('insert') ) {ducx['insert'] = defaultCellEditorParams[actionName]['insert'] }
        }
    } else { duc[actionName] = defaultCellEditorParams[actionName] }

}

function SetFalse () {
    return {'update': false,  'insert': false}
}



module.exports = CrudColumnInit
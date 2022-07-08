//prepends delete/undo column to grid
const data_config = require('../../../DataConfig')
const meta_delete_undo_name = data_config['meta_delete_undo_name']


function ColumnColumnInit(grid) {
    /*
    Used to add delete/undo button to grid. Handles intialization parameters if provided.
    Sets paramaters on when to show the delete/undo options.

    allways available and at beginning.

    data in rowData contains backup values and delete_status
    */
    let du_column = {}
    for(let i=0; i < grid.length; i++) {
        let grid_column = grid[i]
        if (grid_column['field'] === meta_delete_undo_name ) { //use cell editor?
            du_column  = grid_column
            break
        }
    }
    du_column['showSort']   = false
    du_column['showFilter'] = false

    //hide button if all false dont show
    if (du_column.hasOwnProperty('allowAction') ) { 
        if (du_column['allowAction'] === false) {
            du_column['hide'] = true
            du_column['suppressToolPanel'] = true //suppressToolPanel - removes it from the tool panel.
            return
        } 
    }
    //defaultParameters
    let headerName = 'GridAction'
    let defaultCellEditorParams = {
        "allowDelete":{'update': true, 'insert': false}, //shows delete for pulled data only (has precedence)
        "allowUndo": {'update': true,  'insert': true} //shows undo for insert and update  (has precedence)
    }
    if (!du_column.hasOwnProperty('headerName') ) { du_column['headerName'] = headerName }        
    if (!du_column.hasOwnProperty('cellEditor') ) { du_column['cellEditor'] = 'deleteUndoSelector' }        
    if (!du_column.hasOwnProperty('cellEditorParams') ) {
        du_column['cellEditorParams'] = defaultCellEditorParams
        if (!du_defined) { grid.unshift(du_column) }
        return
    }
    let duc = du_column['cellEditorParams']
    if (duc.hasOwnProperty('allowDelete') ) {
        let ducx = duc['allowDelete']
        if (! ducx.hasOwnProperty('update') ) {ducx['update'] = defaultCellEditorParams['allowDelete']['update'] }
        if (! ducx.hasOwnProperty('delete') ) {ducx['delete'] = defaultCellEditorParams['allowDelete']['delete'] }
    } else { duc['allowDelete'] = defaultCellEditorParams['allowDelete'] }
    if (duc.hasOwnProperty('allowUndo')) {
        let ducx = duc['allowUndo']
        if (! ducx.hasOwnProperty('update') ) {ducx['update'] = defaultCellEditorParams['allowDelete']['update'] }
        if (! ducx.hasOwnProperty('delete') ) {ducx['delete'] = defaultCellEditorParams['allowDelete']['delete'] }
    } else { duc['allowUndo'] = defaultCellEditorParams['allowUndo'] }
    //typechecks
    //always at beginning. maybe hidden though.
    grid.unshift(du_column)
}

module.exports = ColumnColumnInit

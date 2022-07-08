/*
Creates meta column and auxilarly functions.

Must be ran as last function in grid_parser.
Requires validator to be a function if defined.
defaultValues: []

addRowData to subgrid values?

deleteUndoColumnParams
isRequired: true/false
ignoreValidator: true/false (for calculated fields?) allow to pass or skip?

Creates Auxillary function for crud operations

*/
const type_check  = require('../../../../TypeCheck')
const crud_column = require('./crud_column')

class MetaColumnAssembly {
    constructor() {}

    RunInit(grid) {
        this.MetaColumn( grid )
        this.InitializeDeleteUndoColumn(grid)
        let funcs = this.MetaAuxillaryFunction( grid )
        return funcs
    }


    CrudColumn( grid ) {
        /*Adds meta column to columnDefs. responsible for handling meta data and types like backups*/
        crud_column.CrudColumnInit(grid)
    }

    CreateAuxillaryFunction( grid ) {
        /*
        Creates object stored in meta_column. Stores backup and 
    
            // function (aggrid_params, backup_fields, crud_type) {
            //     //crud_type is insert or update 
            //  new rows default to insert. 
            // rows generated from query default to update. crud reroutes can be set in
            // pages config.
            // let backups = {'backups': {}, 'row_type': '' }
        */
    
        //is_crud
        //need to add column for delete
        let backups = this.CreateMetaBackupColumn(grid)
        let fupdate = this.InitDefaultUpdateRow(backups) //for rows created from querying the database
        let finsert = this.InitDefaultInsertRow(backups) //for newly added rows via add row or new_sheet
        let fundo   = this.UndoRow(backups) //function to reset row based on backup values
        let fdel    = this.DeleteRow()
        let ferror  = this.RowHasError(grid) //combines all validations functions
        let fwarn   = this.RowHasWarning(grid) //validations with ignored error
        let fcomp   = this.RowIsComplete(grid) //all required fields and not empty
        let fchange = this.RowIsChanged(grid)  //different from backup fields
        let grid_functions =  {'finsert': finsert, 'fupdate': fupdate, 'fundo': fundo,
            'fdel': fdel, 'ferror': ferror, 'fcomp': fcomp, 'fchange': fchange, 'fwarn': fwarn }
        let fis_save = this.IsSaveRow(grid_functions)
        grid_functions['fis_save'] = fis_save
        grid_functions['deleteWarning'] = ""
        if (grid.hasOwnProperty('deleteWarning') ) {
            //displays on save to warn of possible rejected deletes
            grid_functions['deleteWarning'] = grid['deleteWarning']
        }
        return grid_functions
    }


}



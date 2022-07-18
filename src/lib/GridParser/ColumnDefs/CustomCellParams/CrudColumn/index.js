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
const CrudColumnInit   = require('./crud_column')
const CrudColumnFunctions = require('./crud_functions')

class MetaColumnAssembly {
    constructor() {}

    MetaColumnInit(grid) {
        this.CrudColumn( grid )
        let funcs = this.CreateAuxillaryFunction( grid )
        return funcs
    }


    CrudColumn( grid ) {
        /*Adds meta column to columnDefs. responsible for handling meta data and types like backups*/
        CrudColumnInit(grid)
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
        let tmp = new CrudColumnFunctions()
        let grid_functions = tmp.CreateAuxilaryFunction( grid )
        return grid_functions
    }
}

module.exports = MetaColumnAssembly


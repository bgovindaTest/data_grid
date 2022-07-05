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
const type_check = require('../TypeCheck')
const meta_column_name = '_ag-meta_'
const meta_delete_undo_name = '_ag-meta-delete-undo_'


class MetaColumnAssembly {
    constructor() {}

    RunInit(grid) {
        this.MetaColumn( grid )
        this.InitializeDeleteUndoColumn(grid)
        let funcs = this.MetaAuxillaryFunction( grid )
        return funcs
    }


    MetaColumn( grid ) {
        /*Adds meta column to columnDefs. responsible for handling meta data and types like backups*/
        let mx = {
            'field': meta_column_name,
            'editable': false,
            'hide': true,
            'suppressToolPanel': true,
            'showSort': false,
            'showFilter': false
        }
        //need overwrites for debugging
        grid.push(mx)
    }

    MetaAuxillaryFunction( grid ) {
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
    
    //meta functions for creating and reseting rows
    CreateMetaBackupColumn( grid ) {
        //parse grid and creates backups object.
        let backups = {}
        for(let i=0; i < grid.length; i++) {
            let grid_column = grid[i]
            if (! grid_column.hasOwnProperty('isCrud') ) {continue}
            let field_name = grid_column['field']
            let default_value = null
            if (grid_column.hasOwnProperty('defaultValue')) {
                default_value = grid_column['defaultValue'].value || null
            }
            backups[field_name] = default_value
        }
        return backups
    }
    
    InitDefaultInsertRow(defaultValues) {
        /*
            Adds default values to rows. or null
            default values or null
        */
    
        //Adds default value or null to new rows.
        //default values
        let fi = function (rowData) {
            let meta_column = { 'crudType': 'insert', 'meta_delete_undo_name': false }
            let field_names = Object.keys(backups)
            let meta_backup = {}
            for (let i = 0; i< field_names.length; i++ ) {
                let field_name = field_names[i]
                meta_backup[field_name] = backups[field_name]
            }
            meta_column['backups'] = meta_backup
            return meta_column
        }
        return fi
    }
    InitDefaultUpdateRow(backups) {
        //adds rowData pulled from server to rows
        let fu = function (row_data) {
            //row_data is whats stored in server object
            let meta_column = { 'crudType': 'update', 'meta_delete_undo_name': false }
            let field_names = Object.keys(backups)
            let meta_backup = {}
            for (let i = 0; i< field_names.length; i++ ) {
                let field_name = field_names[i]
                if (row_data.hasOwnProperty(field_name) ) { meta_backup[field_name] = row_data[field_name] }
                else { meta_backup[field_name] = null }
            }
            meta_column['backups'] = meta_backup
            return meta_column
        }
        return fu
    }
    UndoRow() {
        let fundo = function (row_data) {
            //undo row to initial state.
            if (! row_data.hasOwnProperty( meta_column_name )) {return}
            let meta_column = row_data[ meta_column_name]
            let meta_backup = meta_column[ 'backups' ]
            let field_names = Object.keys(meta_backup)
            for (let i = 0; i< field_names.length; i++ ) {
                let field_name = field_names[i]
                row_data[field_name] = meta_backup[field_name]
            }
            row_data[meta_delete_undo_name] = false
        }
        return fundo
    }
    DeleteRow() {
        let fdel = function (row_data) {
            //undo row to initial state.
            if (! row_data.hasOwnProperty( meta_delete_undo_name )) {return}
            row_data[meta_delete_undo_name] = true
        }
        return fdel
    
    }
    IsDeleted(row_data) {
        if (! row_data.hasOwnProperty(meta_column_name)) {return false}
        let metacol = row_data[meta_column_name]
        return this.HasPropertyAndTrue(metacol, meta_delete_undo_name )
    }
    //meta field meta field name meta fiel backup
    RowHasError (grid) {
        /*
        Checks if all editable fields are null
        Loops through columns in row whos keys are in the keys variable. If any value is an empty string
        returns true. If a user enters into a cell and leaves, the grid by default leaves an empty string.
    
        need to change empty paramters
        */
    
        let ferror = this.ExtractRowLevelValidations(grid, true)
        return ferror
    }
    RowHasWarning (grid) {
        /*
        Checks if all editable fields are null
        Loops through columns in row whos keys are in the keys variable. If any value is an empty string
        returns true. If a user enters into a cell and leaves, the grid by default leaves an empty string.
    
        need to change empty paramters
        */
        let fwarn = this.ExtractRowLevelValidations(grid, false)
        return fwarn
    }
    
    ExtractRowLevelValidations(grid,is_error) {
        //creates row level error and warning function.
        //return true if there is an error or warning.
        let validators = {} //need to get validation functions.
        let allowNull = {}
        let isRequired = {}
        let fieldsList = []
        let ignoreError = {}
    
        //IsCalculated
        for(let i=0; i < grid.length; i++) {
            let grid_column = grid[i]
            let field = grid_column['field']
            if (grid_column.hasOwnProperty('validator') || grid_column.hasOwnProperty('isCrud') || grid_column.hasOwnProperty('isRequired') ){
                fieldsList.push(field)
            }
            if (grid_column.hasOwnProperty ('ignoreError') ) { ignoreError[field] = grid_column['ignoreError'] }
            if (grid_column.hasOwnProperty( 'isRequired') )  { isRequired[field] = grid_column['isRequired'] }
            if (grid_column.hasOwnProperty( 'allowNull') )   { allowNull[field] = grid_column['allowNull'] }
    
            //add validator based on if error or warning
            if (is_error) {
                if (!grid_column.hasOwnProperty('validator') ) { continue }
                if (this.HasPropertyAndTrue( ignoreError, field) ) { continue }
                validators[field] = grid_column['validator']
    
            } else {
                if (!grid_column.hasOwnProperty('validator') ) { continue }
                if (this.HasPropertyAndFalse( ignoreError, field) ) { continue }
                validators[field] = grid_column['validator']
            }
        }
    
        //does rowData have values for undefined?
        //may need to add values for calculations
        let ferror_warn = function (rowData) {
            for(let i = 0; i < fieldsList.length; i++) {
                let field = fieldsList[i]
                let value = rowData[field]
                if (this.IsUndefined(value) && !this.validators.hasOwnProperty(field) ) {continue}
    
                
                // if (this.HasPropertyAndTrue(isCalculated, field)) {
                // need to check how clauclated fields stored
                // }
                else {value = rowData[field]}
                if (this.HasPropertyAndFalse(allowNull, field) ) { if (type_check.IsNull(value)) { return true }  }
                if (this.HasPropertyAndTrue(isRequired, field))  { if  (type_check.IsNull(value)) { return true } }
                if (validators.hasOwnProperty(field) ) {
                    let fx = validators[field]
                    if (fx(params) === false) { return true}
                }
            }
            return false
        }
        return ferror_warn
    
    }
    
    HasPropertyAndTrue( objectx, key) {
        //key is a string
        if (objectx.hasOwnProperty(key) ) {
            if (objectx[key] === true) {return true}
        }
        return false
    }
    
    HasPropertyAndFalse( objectx, key) {
        //key is a string
        if (objectx.hasOwnProperty(key) ) {
            if (objectx[key] === false) {return true}
            return false
        }
        return false
    }
    
    
    RowIsComplete (grid) { 
        //Determines if cell value is Null. If any value is empty its false
        let noNull = {}
        let isRequired = {}
        let fieldList = []
        for(let i=0; i < grid.length; i++) {
            let grid_column = grid[i]
            let field = grid_column['field']
            if (this.HasPropertyAndTrue( grid_column, 'isCrud') ){ fieldList.push(field) } else {continue}
            if (this.HasPropertyAndTrue( grid_column, 'isRequired') )  { isRequired[field] = true }
            if (this.HasPropertyAndFalse( grid_column,'allowNull') )   { noNull[field] = true }
        }
    
    
        //IsComplete returns false if empty
        let fcomp = function(rowData) {
            let is_empty = true
            for (var i=0; i< fieldList.length; i++) {
                let field = fieldList[i]
                var value = rowData[field]
                if (type_check.IsNull(value) || type_check.IsUndefined(value) ) {
                    if (isRequired.hasOwnProperty(field)) {return false}
                    if (noNull.hasOwnProperty(field)) {return false}
                } else { is_empty = false }
    
            }
            return true && ! is_empty
        }
        return fcomp
    }
    
    //parameters for row
    RowIsChanged (grid) {
        let fieldList = []
        for(let i=0; i < grid.length; i++) {
            let grid_column = grid[i]
            let field = grid_column['field']
            if (this.HasPropertyAndTrue( grid_column, 'isCrud') ){ fieldList.push(field) }
        }
    
        //Determines if cell value is Null. If any value is empty its false
        // console.log(server_fields)
        let fchange = function(rowData) {
            if (this.IsDeleted(rowData)) {return true}
            let is_change = false
            for (var i=0; i< fieldList.length; i++) {
                let field = fieldList[i]
                var value = rowData[field]
                if (value !== this.BackupValue(rowData, field ) ) {is_change = true}
            }
            return is_change
        }
        return fchange
    }
    
    BackupValue(rowData, field) {
        let metacol = rowData[meta_column_name]
        let backups = metacol['backups']
        let backup_value  = backups[field]
        return backup_value
    }
    
    IsSaveRow(grid_functions) {
        /*
        Filter passes if the row should be included for saving.
    
        If new row skip if deleted. if new row and is changed is complete and no error should pass
    
        if old row i.e. for update. Can change if 
    
        loop through everything and return crud params by type
    
        batch and debounce?
        */
        // {'finsert': finsert, 'fupdate': fupdate, 'fundo': fundo,
        // 'fdel': fdel, 'ferror': ferror, 'fcomp': fcomp, 'fchange': fchange }
        let IsChanged       = grid_functions['fchange']
        let IsCompleted     = grid_functions['fcomp']
        let IsError         = grid_functions['ferror']
        let IsWarning       = grid_functions['fwarn']
        let CrudType        = grid_functions['fcrud_type']
    
        let fis_save = function (rowData) {
            let save_object = {'crud_type': null, 'incomplete': false, 'error': false, 'is_save': false,
                'is_warning': false}
            if ( this.IsDeleted(rowData) ) {
                save_object['crud_type'] = 'delete'
                return
            }
    
            if (! IsChanged(rowData) ) { return save_object }
    
            save_object['crud_type'] = CrudType(rowData)
            if (! IsCompleted(rowData)) { 
                save_object['incomplete'] = true
                return save_object
            }
            if (IsError(rowData)) {
                save_object['error'] = true
                return save_object 
            }
            if (IsWarning(rowData)) {
                save_object['error'] = true
                return save_object
            }
            save_object['is_save'] = true
            return save_object
        }
        return fis_save
    }


}



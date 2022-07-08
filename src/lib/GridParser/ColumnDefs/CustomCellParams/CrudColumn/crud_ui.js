/*
Creates the UI components for insert/update/delete as well as tracking status of changes.


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
const data_config = require('../../../DataConfig')
const meta_column_name = data_config['meta_column_name']
const lodashCloneDeep = require('lodash.clonedeep')

class MetaColumnAssembly {
    constructor() {
        this.crud_conditions = null

    }

    RunInit(grid) {
        this.MetaColumn( grid )
        this.InitializeDeleteUndoColumn(grid)
        let funcs = this.MetaAuxillaryFunction( grid )
        return funcs
    }
    CreateAuxilaryFunction( grid ) {
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
        let gf = {}
        let defaultValues  = null
        this.ExtractCrudConditions(grid)
        gf['Insert']       = this.InitInsertRow(defaultValues) //for newly added rows via add row or new_sheet
        gf['Update']       = this.InitUpdateRow(backups) //for rows created from querying the database
        gf['Undo']         = this.UndoRow(backups) //function to reset row based on backup values
        gf['Delete']          = this.DeleteRow()
        gf['UndoDelete']         = this.DeleteUndoRow()
        //grid_changes
        gf['CrudStatus']   = this.CrudStatus()

        //delete_warning
        gf['deleteWarning'] = grid['deleteWarning']
        return gf
    }

    InsertRowInit(defaultValues) {
        /*
            defaultValues from grid_column object.

            Creates a rowData object. Adds default values to fields if specified or null.
            Creates meta column specifing default crudType and backups. Backups used for undo
            and to check if changes were made.

            returns rowData object
        */
        let fx = function () {
            //rowData is empty object
            //fields
            let rowData = {}
            let meta_column = { 'crudType': 'insert', 'is_delete': false }
            let insert_backups = {}
            let field_names = Object.keys(defaultValues)
            for (let i = 0; i< field_names.length; i++ ) {
                let fn = field_names[i]
                let fieldValue = defaultValues[fn].value || null
                rowData[fn] = fieldValue
                insert_backups[fn] = fieldValue
            }
            meta_column['backup'] = insert_backups
            rowData[meta_column_name] = meta_column
            return rowData
        }
        return fx
    }

    UpdateRowInit() {
        /*
            rowData is preporcessed from QueryParams/Pull. Adds metadata column and copies rowData
            to backup
        */
        let fu = function (rowData) {
            //row_data is whats stored in server object
            let rowBackup = lodashCloneDeep(rowData) //messes up column order probably?
            let meta_column = { 'crudType': 'update', 'is_delete': false, 'backup': rowBackup }
            rowData[meta_column_name] = meta_column
        }
        return fu
    }

    UndoRow() {
        //reverts rowData to values from backups
        let fundo = function (rowData) {
            //undo row to initial state.
            let backups = rowData[meta_column_name]['backup']
            let field_names = Object.keys(backups)
            for (let i = 0; i< field_names.length; i++ ) {
                let field_name = field_names[i]
                if (rowData.hasOwnProperty(field_name)) {
                    rowData[field_name] = backups[field_name] || null 
                }
            }
            rowData[meta_column_name]['is_delete'] = false
        }
        return fundo
    }
    DeleteRow() {
        //sets delete to true
        return function (rowData) { rowData[meta_column_name]['is_delete'] = true }
    }
    DeleteUndoRow() {
        //sets delete to false
        return function (rowData) { rowData[meta_column_name]['is_delete'] = false }
    }


    //before crud operations.
    IsRowChanged() {
        //Determines if cell value is Null. If any value is empty its false
        //console.log(server_fields)
        let change_fields = this.crud_conditions['change_fields']
        return function(rowData) {
            if (rowData[meta_column_name]['is_deleted']) {return true}
            let backup = rowData[meta_column_name]['backup']
            for (var i=0; i< change_fields.length; i++) {
                let field = change_fields[i]
                var value = rowData[field]
                if (value !== backup[field] ) {return true}
            }
            return false
        }
    }

    IsRowComplete() {
        let required_fields = this.crud_conditions['required_fields']
        //IsComplete returns false if empty
        return function(rowData) {
            for (var i=0; i< required_fields.length; i++) {
                let field = fieldList[i]
                let value = null
                if (valueGetters.hasOwnProperty(field)) {
                    let fx = valueGetters[field]
                    value = fx({'data':rowData})
                } else { value = rowData[field] }
                if (type_check.IsNull(value) || type_check.IsUndefined(value) ) { return false }
            }
            return true
        }
    }
    IsRowEmpty() {
        //checks if all null change fields are null
        let change_fields = this.crud_conditions['change_fields']
        let valueGetters  = this.crud_conditions['valueGetters']
        return function(rowData) {
            for (var i=0; i< change_fields.length; i++) {
                let field = change_fields[i]
                let value = null
                if (valueGetters.hasOwnProperty(field)) {
                    let fx = valueGetters[field]
                    value = fx({'data':rowData})
                } else { value = rowData[field] }


                if (! type_check.IsNull(value) || !type_check.IsUndefined(value) ) { return false }
            }
            return true
        }
    }

    IsRowDeleted() {
        //check if deleted
        return function (rowData) {
            if (! rowData.hasOwnProperty(meta_column_name)) {return false}
            let is_delete  = rowData[meta_column_name]['is_delete']
            return is_delete
        }
        

    }



    IsRowWarning() {

        //checks if all null change fields are null
        let change_fields = this.crud_conditions['change_fields']
        let validators    = this.crud_conditions['valueGetters']
        return function(rowData) {
            for (var i=0; i< change_fields.length; i++) {
                let field = change_fields[i]
                var value = rowData[field]
                if (! type_check.IsNull(value) || !type_check.IsUndefined(value) ) { return false }
            }
            return true
        }
    }
    IsRowError() {

        //checks if all null change fields are null
        let change_fields = this.crud_conditions['change_fields']
        let validators    = this.crud_conditions['valueGetters']

        return function(rowData) {
            for (var i=0; i< change_fields.length; i++) {
                let field = change_fields[i]
                var value = rowData[field]
                if (! type_check.IsNull(value) || !type_check.IsUndefined(value) ) { return false }
            }
            return true
        }
    }

    CrudType() {
        return function (rowData) {
            return rowData[meta_column_name]['crudType']
        }
    }


    CrudStatus() {
        /*
        returns crud_status of function
    
        If new row skip if deleted. if new row and is changed is complete and no error should pass
    
        if old row i.e. for update. Can change if 
    
        loop through everything and return crud params by type
    
        batch and debounce?
        */
        // {'finsert': finsert, 'fupdate': fupdate, 'fundo': fundo,
        // 'fdel': fdel, 'ferror': ferror, 'fcomp': fcomp, 'fchange': fchange }
        const IsDeleted       = this.IsRowDeleted()
        const IsChanged       = this.IsRowChanged()
        const IsCompleted     = this.IsRowComplete()
        const IsError         = this.IsRowError()
        const IsEmpty         = this.IsRowEmpty()
        const IsWarning       = this.IsRowEmpty()
        const IsCrudType      = this.CrudType()
    
        return function (rowData) {
            let crud_status = {'crudType': null, 'is_complete': false, 'is_error': false, 'is_save': false,
                'is_warning': false, 'is_delete': false, 'is_empty': false, 'is_changed': false}

            crud_status['is_delete']  = IsDeleted(rowData)
            crud_status['crudType']   = IsCrudType(rowData)
            crud_status['is_error']   = IsError(rowData)
            crud_status['is_changed'] = IsChanged(rowData)
            crud_status['is_empty']   = IsEmpty(rowData)
            crud_status['is_warning'] = IsWarning(rowData)
            crud_status['is_complete']= IsCompleted(rowData)

            if (crud_status['is_delete']) { crud_status['is_save'] = true }
            else {
                crud_status['is_save'] = crud_status['is_complete'] && !crud_status['is_empty'] && !crud_status['is_error'] && crud_status['is_changed']
            }
            return crud_status
        }
    }








    ExtractCrudConditions(grid) {
        /*
            List values that are required for change detection and/or cant be null
            ignoreValidator: true/false (for calculated fields?) allow to pass or skip?
            valueGetter:
            validator
        */
        let change_fields   = []
        let required_fields = []
        let validators   = {}
        let valueGetters = {}
        for(let i=0; i < grid.length; i++) {
            let grid_column = grid[i]
            let field = grid_column['field']
            let is_crud = grid_column['isCrud']
            if (is_crud['isChange']) { change_fields.push(field) }
            if (grid_column['isRequired']) {required_fields.push(field)}
            if (!grid_column['isRequired'] && is_crud['isChange']) {continue}
            if (grid_column.hasOwnProperty('valueGetter') ) {
                let vg = grid_column['valueGetter']
                if (type_check.IsFunction(vg)) {
                    valueGetters[field] = grid_column['valueGetter']
                }
            }

            if (grid_column.hasOwnProperty('validator') ) {
                let vg = grid_column['validator']
                let ignoreValidator = false
                if (grid_column.hasOwnProperty('ignoreValidator')) {
                    let ix = ignoreValidator
                    if (type_check.IsBoolean(ix) ) {ignoreValidator = ix}
                }
                validators[field] = {'validator': vg, 'ignoreValidator': ignoreValidator}

            }


        }
        this.crud_conditions = {'change_fields': change_fields, 'required_fields': required_fields, 
            'validators': validators, 'ignoreValidator': ignoreValidator}
    }


    




}




// //does rowData have values for undefined?
// //may need to add values for calculations
// let ferror_warn = function (rowData) {
//     for(let i = 0; i < fieldsList.length; i++) {
//         let field = fieldsList[i]
//         let value = rowData[field]
//         if (this.IsUndefined(value) && !this.validators.hasOwnProperty(field) ) {continue}

        
//         // if (this.HasPropertyAndTrue(isCalculated, field)) {
//         // need to check how clauclated fields stored
//         // }
//         else {value = rowData[field]}
//         if (this.HasPropertyAndFalse(allowNull, field) ) { if (type_check.IsNull(value)) { return true }  }
//         if (this.HasPropertyAndTrue(isRequired, field))  { if  (type_check.IsNull(value)) { return true } }
//         if (validators.hasOwnProperty(field) ) {
//             let fx = validators[field]
//             if (fx(params) === false) { return true}
//         }
//     }
//     return false
// }
// return ferror_warn

// }






//     //meta field meta field name meta fiel backup
//     RowHasError (grid) {
//         /*
//         Checks if all editable fields are null
//         Loops through columns in row whos keys are in the keys variable. If any value is an empty string
//         returns true. If a user enters into a cell and leaves, the grid by default leaves an empty string.
    
//         need to change empty paramters
//         */
    
//         let ferror = this.ExtractRowLevelValidations(grid, true)
//         return ferror
//     }
//     RowHasWarning (grid) {
//         /*
//         Checks if all editable fields are null
//         Loops through columns in row whos keys are in the keys variable. If any value is an empty string
//         returns true. If a user enters into a cell and leaves, the grid by default leaves an empty string.
    
//         need to change empty paramters
//         */
//         let fwarn = this.ExtractRowLevelValidations(grid, false)
//         return fwarn
//     }
    
//     ExtractRowLevelValidations(grid,is_error) {
//         //creates row level error and warning function.
//         //return true if there is an error or warning.
//         let validators = {} //need to get validation functions.
//         let allowNull = {}
//         let isRequired = {}
//         let fieldsList = []
//         let ignoreError = {}
    
//         //IsCalculated
//         for(let i=0; i < grid.length; i++) {
//             let grid_column = grid[i]
//             let field = grid_column['field']
//             if (grid_column.hasOwnProperty('validator') || grid_column.hasOwnProperty('isCrud') || grid_column.hasOwnProperty('isRequired') ){
//                 fieldsList.push(field)
//             }
//             if (grid_column.hasOwnProperty ('ignoreError') ) { ignoreError[field] = grid_column['ignoreError'] }
//             if (grid_column.hasOwnProperty( 'isRequired') )  { isRequired[field] = grid_column['isRequired'] }
//             if (grid_column.hasOwnProperty( 'allowNull') )   { allowNull[field] = grid_column['allowNull'] }
    
//             //add validator based on if error or warning
//             if (is_error) {
//                 if (!grid_column.hasOwnProperty('validator') ) { continue }
//                 if (this.HasPropertyAndTrue( ignoreError, field) ) { continue }
//                 validators[field] = grid_column['validator']
    
//             } else {
//                 if (!grid_column.hasOwnProperty('validator') ) { continue }
//                 if (this.HasPropertyAndFalse( ignoreError, field) ) { continue }
//                 validators[field] = grid_column['validator']
//             }
//         }
    
//         //does rowData have values for undefined?
//         //may need to add values for calculations
//         let ferror_warn = function (rowData) {
//             for(let i = 0; i < fieldsList.length; i++) {
//                 let field = fieldsList[i]
//                 let value = rowData[field]
//                 if (this.IsUndefined(value) && !this.validators.hasOwnProperty(field) ) {continue}
    
                
//                 // if (this.HasPropertyAndTrue(isCalculated, field)) {
//                 // need to check how clauclated fields stored
//                 // }
//                 else {value = rowData[field]}
//                 if (this.HasPropertyAndFalse(allowNull, field) ) { if (type_check.IsNull(value)) { return true }  }
//                 if (this.HasPropertyAndTrue(isRequired, field))  { if  (type_check.IsNull(value)) { return true } }
//                 if (validators.hasOwnProperty(field) ) {
//                     let fx = validators[field]
//                     if (fx(params) === false) { return true}
//                 }
//             }
//             return false
//         }
//         return ferror_warn
    
//     }
    
//     HasPropertyAndTrue( objectx, key) {
//         //key is a string
//         if (objectx.hasOwnProperty(key) ) {
//             if (objectx[key] === true) {return true}
//         }
//         return false
//     }
    
//     HasPropertyAndFalse( objectx, key) {
//         //key is a string
//         if (objectx.hasOwnProperty(key) ) {
//             if (objectx[key] === false) {return true}
//             return false
//         }
//         return false
//     }
    

//     CrudReroute

//     CrudStatus(grid_functions) {
//         /*
//         returns crud_status of function
    
//         If new row skip if deleted. if new row and is changed is complete and no error should pass
    
//         if old row i.e. for update. Can change if 
    
//         loop through everything and return crud params by type
    
//         batch and debounce?
//         */
//         // {'finsert': finsert, 'fupdate': fupdate, 'fundo': fundo,
//         // 'fdel': fdel, 'ferror': ferror, 'fcomp': fcomp, 'fchange': fchange }
//         let IsChanged       = grid_functions['fchange']
//         let IsCompleted     = grid_functions['fcomp']
//         let IsError         = grid_functions['ferror']
//         let IsWarning       = grid_functions['fwarn']
//         let CrudType        = grid_functions['fcrud_type']
    
//         let fis_save = function (rowData) {
//             let save_object = {'crud_type': null, 'incomplete': false, 'error': false, 'is_save': false,
//                 'is_warning': false}
//             if ( this.IsDeleted(rowData) ) {
//                 save_object['crud_type'] = 'delete'
//                 return
//             }




//             if (! IsChanged(rowData) ) { return save_object }
    
//             save_object['crud_type'] = CrudType(rowData)
//             if (! IsCompleted(rowData)) { 
//                 save_object['incomplete'] = true
//                 return save_object
//             }
//             if (IsError(rowData)) {
//                 save_object['error'] = true
//                 return save_object 
//             }
//             if (IsWarning(rowData)) {
//                 save_object['error'] = true
//                 return save_object
//             }
//             save_object['is_save'] = true
//             return save_object
//         }
//         return fis_save
//     }


// }

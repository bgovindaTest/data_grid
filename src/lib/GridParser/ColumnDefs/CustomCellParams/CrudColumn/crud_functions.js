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
const type_check = require('../../../../TypeCheck')
const data_config = require('../../../../DataConfig')
const meta_column_name = data_config['meta_column_name']
const lodashCloneDeep = require('lodash.clonedeep')

class CrudColumnFunctions {
    constructor() {
        this.crud_conditions = null
        this.defaultValues   = null
        //cloneOnCopy if true add fields values to new row else set as null
        this.cloneOnCopy     = null 
    }

    // RunInit(grid) {
    //     this.DefaultValuesParse( grid )
    //     let funcs = this.CreateAuxilaryFunction(grid)
    //     return funcs
    // }
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

        //for copy
        //https://stackoverflow.com/questions/36419195/how-can-i-get-the-index-from-a-json-object-with-value
        // var data = [{"name":"placeHolder","section":"right"},{"name":"Overview","section":"left"},
        //{"name":"ByFunction","section":"left"},{"name":"Time","section":"left"},{"name":"allFit","section":"left"},
        //{"name":"allbMatches","section":"left"},{"name":"allOffers","section":"left"},{"name":"allInterests","section":"left"},
        //{"name":"allResponses","section":"left"},{"name":"divChanged","section":"right"}];
        // var index = -1;
        // var val = "allInterests"
        // var filteredObj = data.find(function(item, i){
        //   if(item.name === val){
        //     index = i;
        //     return i;
        //   }
        // });
        
        // console.log(index, filteredObj);


        //is_crud
        //need to add column for delete
        let gf = {}
        this.DefaultValues(grid)
        let defaultValues  = this.defaultValues
        this.ExtractCrudConditions(grid)
        gf['Insert']       = this.InsertRowInit(defaultValues) //for newly added rows via add row or new_sheet
        gf['CopyRow']      = this.CopyRowInit()
        gf['Update']       = this.UpdateRowInit() //for rows created from querying the database
        gf['Undo']         = this.UndoRow() //function to reset row based on backup values
        gf['Delete']       = this.DeleteRow()
        gf['UndoDelete']   = this.DeleteUndoRow()
        //grid_changes before saving
        gf['CrudStatus']   = this.CrudStatus()

        //delete_warning
        gf['deleteWarning'] = grid['deleteWarning'] || ""
        return gf
    }

    DefaultValues( grid ) {
        //get default values from grid columns
        let defValue = {}
        for (let i =0; i<grid.length; i++ ) {
            let grid_column = grid[i]
            let defaultValue = grid_column['defaultValue']
            let field = grid_column['field']
            defValue[field] = defaultValue
        }
        this.defaultValues = defValue
    }


    InsertRowInit(defaultValues) {
        /*
            defaultValues from grid_column object.

            Creates a rowData object. Adds default values to fields if specified or null.
            Creates meta column specifing default crudType and backups. Backups used for undo
            and to check if changes were made.

            returns rowData object
        */
        const rdv = this.ReturnDefaultValue
        let fx = function () {
            //rowData is empty object
            //fields
            let rowData = {}
            let meta_column = { 'crudType': 'insert', 'is_delete': false }
            let insert_backups = {}
            let field_names = Object.keys(defaultValues)
            for (let i = 0; i< field_names.length; i++ ) {
                let fn = field_names[i]
                let fieldValue = rdv(defaultValues, fn)
                rowData[fn] = fieldValue
                insert_backups[fn] = fieldValue
            }
            meta_column['backup'] = insert_backups
            rowData[meta_column_name] = meta_column
            return rowData
        }
        return fx
    }

    ReturnDefaultValue(defaultValues, field) {
        return defaultValues[field].value || null
    }

    CopyRowInit() {
        /*
        Row level addition. Used to copy lookups rows for quickly adding rows
        that come from several refernce tables.
            //crudType
            //is_delete, allow_delete
            //lodashCloneDeep
            //setNull
        */
        let meta_column = { 'crudType': 'insert', 'is_delete': false }
        let setCopy = this.cloneOnCopy
        let frow_copy = function (params) {
            let initRowData = params.data
            let keys = Object.keys(initRowData)
            let newRowData = {}
            newRowData[meta_column_name] = meta_column
            for (let i =0; i< keys.length; i++) {
                let field = keys[i]
                if (field === meta_column_name) {continue}
                if (setCopy.includes(field) ) {
                    //lodashCloneDeep
                    let val = params.data[field]
                    if (type_check.IsObject(val) || type_check.IsArray(val) ) {
                        newRowData[field] = lodashCloneDeep(val)
                    } else if (type_check.IsUndefined(val)) {
                        newRowData[field] = null
                    } 
                    else { newRowData[field] = val }
                } else { newRowData[field] = null }
            }
            meta_column['backup'] = lodashCloneDeep(newRowData)
            return newRow
        }
        return frow_copy
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
        let DeleteRow = function (rowData) { rowData[meta_column_name]['is_delete'] = true }
        return DeleteRow
    }
    DeleteUndoRow() {
        //sets delete to false
        return function DeleteUndoRow (rowData) { rowData[meta_column_name]['is_delete'] = false }
    }


    //before crud operations.
    IsRowChanged() {
        //Determines if cell value is Null. If any value is empty its false
        //console.log(server_fields)
        let change_fields = this.crud_conditions['change_fields']
        return function IsChanged (rowData) {
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
        let valueGetters    = this.crud_conditions['valueGetters']
        //IsComplete returns false if empty
        return function IsComplete(rowData) {
            for (var i=0; i< required_fields.length; i++) {
                let field = required_fields[i]
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
        return function IsEmpty (rowData) {

            let is_empty = true
            for (var i=0; i< change_fields.length; i++) {
                let field = change_fields[i]
                let value = null
                if (valueGetters.hasOwnProperty(field)) {
                    let fx = valueGetters[field]
                    value = fx({'data':rowData})
                } else { value = rowData[field] }

                if (type_check.IsUndefined(value)) {value = null}

                if ( ! type_check.IsNull(value)   ) {
                    is_empty = false
                    break
                }
            }
            return is_empty
        }
    }

    IsRowDeleted() {
        //check if deleted
        let IsDeleted = function (rowData) {
            if (! rowData.hasOwnProperty(meta_column_name)) {return false}
            let is_delete  = rowData[meta_column_name]['is_delete']
            return is_delete
        }
        return IsDeleted
    }

    IsRowWarning() {

        //checks if all null change fields are null
        let ignoreErrors = this.crud_conditions['ignoreError']
        let validators    = this.crud_conditions['validators']
        let ex = Object.keys(ignoreErrors)
        let warn_fields = []
        for (let i =0; i<ex.length; i++) {
            let field = ex[i]
            let igE = ignoreErrors[field]
            if (igE) {warn_fields.push(field)}
        }
        return function IsWarning (rowData) {
            for (var i=0; i< warn_fields.length; i++) {
                let field = warn_fields[i]
                let vf = validators[field]
                //if not valid
                if (! vf({'data': rowData}) )  {return true}
            }
            return false
        }
    }
    IsRowError() {
        //checks if all null change fields are null
        let ignoreErrors = this.crud_conditions['ignoreError']
        let validators    = this.crud_conditions['validators']
        let ex = Object.keys(ignoreErrors)
        let error_fields = []
        for (let i =0; i<ex.length; i++) {
            let field = ex[i]
            let igE = ignoreErrors[field]
            if (!igE) {error_fields.push(field)}
        }
        return function IsError (rowData) {
            for (var i=0; i< error_fields.length; i++) {
                let field = error_fields[i]
                let vf    = validators[field]
                //if not valid
                if (! vf({'data': rowData}) )  {return true}
            }
            return false
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
        const IsWarning       = this.IsRowWarning()
        const IsCrudType      = this.CrudType()
    
        return function CrudStatus (rowData) {
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
            ignoreError: true/false for validators allow to pass or skip?
            valueGetter:
            validator
        */
        let change_fields   = []
        let required_fields = []
        let validators   = {}
        let valueGetters = {}
        let ignoreError  = {}
        for(let i=0; i < grid.length; i++) {
            let grid_column = grid[i]
            let field = grid_column['field']
            let is_crud = grid_column['chmodParams']

            if (is_crud['isChange']) { change_fields.push(field) }
            if (grid_column['isRequired']) {required_fields.push(field)}


            //if (!grid_column['isRequired'] && is_crud['isChange']) {continue}
            if (grid_column.hasOwnProperty('valueGetter') ) {
                let vg = grid_column['valueGetter']
                if (type_check.IsFunction(vg)) {
                    valueGetters[field] = grid_column['valueGetter']
                }
            }

            if (grid_column.hasOwnProperty('validator') ) {
                let vg = grid_column['validator']
                let ignoreE = false
                if (grid_column.hasOwnProperty('ignoreError')) {
                    let tmpIgnoreE = grid_column['ignoreError']
                    if (type_check.IsBoolean(tmpIgnoreE) ) {ignoreE = tmpIgnoreE}
                }
                validators[field] = vg
                ignoreError[field] = ignoreE
            }
        }
        this.SetCloneFields(grid)
        this.crud_conditions = {'change_fields': change_fields, 'required_fields': required_fields, 
            'validators': validators, 'valueGetters': valueGetters, 'ignoreError': ignoreError}
    }
    SetCloneFields(grid) {
        this.cloneOnCopy = []
        for(let i=0; i < grid.length; i++) {
            let grid_column = grid[i]
            let field = grid_column['field']
            if (grid_column['cloneOnCopy'] || false) {
                this.cloneOnCopy.push(field)
            }
        }
    }
}

module.exports = CrudColumnFunctions
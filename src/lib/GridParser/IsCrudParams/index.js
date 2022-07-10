/*
Sets parameters for isCrud. This determines 

isCrud: {
    isPull: bool,
    isPush: bool,
    isChange: bool,
}

isPull:   field gets pulled from the server
isPush:   field gets pushed from the server
isChange: field can be modified in the UI. Determines what fields
    are watched for changes. Only rows that have some change detection are
    sent to the server

isCrud: bool or string: rwc  (read write or change)
editable: boolean or conditional based on row params


*/
const type_check = require('../../TypeCheck')

//IsBoolean
//IsObject (x)



class CrudInit {
    constructor (grid_column) {
        this.grid_column = grid_column
        this.is_edit   = false
    }
    RunInit() {
        this.IsEditable()
        this.SetCrud()
    }
    SetCrud() {
        let gc = this.grid_column
        let is_crud = gc['isCrud'] || null
        if (this.EditableDefault()) { return }
        else if (this.NullDefault() ) {return }
        else if (this.BooleanDefault() ) { return  }
        //Editable Default

        //parseString
        if (type_check.IsString(is_crud) ) {
            gc['isCrud'] = CreateCrudObject(false,false,false)
            if (is_crud.include('r') ) { gc['isCrud']['isPull'] = true } 
            else if (is_crud.includes('w') ) { gc['isCrud']['isPush'] = true }
            else if (is_crud.includes('c') ) { gc['isCrud']['isChange'] = true }
            SetCrudDefaults(gc['isCrud'])
        } //parse object
        else if (! type_check.IsObject(is_crud) ) { 
            let cp = {}
            SetCrudDefaults(cp)
            gc['isCrud'] = cp
        } else { SetCrudDefaults(gc['isCrud']) }
        //throw error
    }
    IsEditable() {
        let is_edit = this.grid_column['editable'] || false
        if (is_edit === false) {return}
        //if true or something else
        this.is_edit = true
    }
    EditableDefault( ) {
        let is_crud = this.grid_column['isCrud'] || null
        if (is_crud === null && this.is_edit) { 
            this.grid_column['isCrud'] = CreateCrudObject(true, true, true)
            return true
        }
        return false
    }
    NullDefault() {
        if (type_check.IsNull(is_crud)) { 
            gc['isCrud'] = CreateCrudObject(false,false,false)
            return
        }
    }
    BooleanDefault() {
        //Editable Default
        if (type_check.IsBool(is_crud)) {
            let is_edit = this.is_edit
            if (is_crud === true) {
                gc['isCrud'] = CreateCrudObject(true, true, is_edit)
                //read and write true
            } else {
                //read and write are false
                gc['isCrud'] = CreateCrudObject(false, false, is_edit)
            }
            return
        }   
    }

}

function CreateCrudObject(isPull, isPush, isChange) {
    return {
        'isPull':   isPull,
        'isPush':   isPush,
        'isChange': isChange,
    }
}

function SetCrudDefaults(crudParams) {
    let bool_val = false
    if (this.is_edit) {bool_val = true}

    if (! crudParams.hasOwnProperty('isPull'))   {crudParams['isPull']   = bool_val}
    if (! crudParams.hasOwnProperty('isPush'))   {crudParams['isPush']   = bool_val}
    if (! crudParams.hasOwnProperty('isChange')) {crudParams['isChange'] = bool_val}
}


module.exports = CrudInit
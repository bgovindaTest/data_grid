/*
Sets parameters for chmod. This determines 

chmodParams: {
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

chmod mod is a unix command for setting permissions for read/write/execute
here
r: isPull   (expects data from server)
w: isPush   (sends data to server)
x: isChange (if value changed the row is marked as modified and data is sent on save)

*/
const type_check = require('../../TypeCheck')

//IsBoolean
//IsObject (x)
//chmodParams



class ChmodParams {
    constructor (grid_column) {
        this.grid_column = grid_column
        this.is_edit   = false
    }
    ChmodParamsInit() {
        this.IsEditable()
        this.SetCrud()
    }
    SetCrud() {
        let gc = this.grid_column
        let is_crud = gc['chmodParams'] || null
        if (this.EditableDefault()) { return }
        else if (this.NullDefault() ) {return }
        else if (this.BooleanDefault() ) { return  }
        //Editable Default

        //parseString
        if (type_check.IsString(is_crud) ) {
            gc['chmodParams'] = CreateCrudObject(false,false,false)
            if (is_crud.includes('r') ) { gc['chmodParams']['isPull'] = true } 
            if (is_crud.includes('w') ) { gc['chmodParams']['isPush'] = true }
            if (is_crud.includes('c') ) { gc['chmodParams']['isChange'] = true }
            SetCrudDefaults(gc['chmodParams'])
        } //parse object
        else if (! type_check.IsObject(is_crud) ) { 
            let cp = {}
            SetCrudDefaults(cp)
            gc['chmodParams'] = cp
        } else { SetCrudDefaults(gc['chmodParams']) }
        //throw error
    }
    IsEditable() {
        let is_edit = this.grid_column['editable'] || false
        if (is_edit === false) {return}
        //if true or something else
        this.is_edit = true
    }
    EditableDefault( ) {
        let gc = this.grid_column
        let is_crud = this.grid_column['chmodParams'] || null
        if (is_crud === null && this.is_edit) { 
            this.grid_column['chmodParams'] = CreateCrudObject(true, true, true)
            return true
        }
        return false
    }
    NullDefault() {
        let gc = this.grid_column
        let is_crud = this.grid_column['chmodParams'] || null
        if (type_check.IsNull(is_crud)) { 
            gc['chmodParams'] = CreateCrudObject(false,false,false)
            return
        }
    }
    BooleanDefault() {
        //Editable Default
        let gc = this.grid_column
        let is_crud = this.grid_column['chmodParams'] || null
        if (type_check.IsBoolean(is_crud)) {
            let is_edit = this.is_edit
            if (is_crud === true) {
                gc['chmodParams'] = CreateCrudObject(true, true, is_edit)
                //read and write true
            } else {
                //read and write are false
                gc['chmodParams'] = CreateCrudObject(false, false, is_edit)
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


module.exports = ChmodParams
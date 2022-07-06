/*
Responsible for creating each columns rules for displaying and formatting the data.

grid: json array of the grid
grid_column:
valuesObject: the json array object for autocomplete and richselector.
*/

//import crud column
const crudColumn = require('./CrudColumn')

class CustomCellParams {
    //for main loader
    //grid is json object for aggrid
    //allowNull (prepends value?)

    //valuesArray created by grid_func mix in?
    constructor(grid, valuesObject) {
        this.grid         = grid
        this.valuesObject = valuesObject
        this.cellEditor   = ""
    }
    RunInit() {

        for(let i=0; i < this.grid.length; i++) {
            this.cellEditor = this.grid_column['cellEditor'] || ""
            if (this.cellEditor === "") { return }
            this.AutoCompleteParams()
            this.AgRichSelectParams()
            this.DeleteUndoParams()


        }
        this.SubGridParams()
        //crudColumn
        //returns functions?
    }

    AutoCompleteParams() {}
    AgRichSelectParams() {}
    DeleteUndoParams()   {}
    SubGridParams()      {}
    AgLargeTextParams() {}


}

// async CellEditorParams(grid_column) {
//     /*
//     Handles specialized modules. i.e. autocomplete and aggrid rich cell editor

//     Adds valueGetter and valueSetter inorder to handle data processing.

//     Pull Data if needed on init?

//     */
//     if (! grid_column.hasOwnProperty('cellEditor')) {return}
//     let cedit = grid_column['cellEditor']
//     //check cell editor type?
//     if (cedit === 'agRichSelectCellEditor' ) {}
//     else if (cedit === 'subGrid' ) {} //has placeholder for modal?
//     else if (cedit === 'dateSelector' ) {}
//     else if (cedit === 'autoComplete' ) {}
// }




module.exports = {'CustomCellParams': CustomCellParams}
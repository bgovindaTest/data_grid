/*
Responsible for creating each columns rules for displaying and formatting the data.

grid: json array of the grid
grid_column:
valuesObject: the json array object for autocomplete and richselector.
*/

class CustomCellParams {
    //for main loader
    //grid is json object for aggrid
    //allowNull (prepends value?)

    //valuesArray created by grid_func mix in?
    constructor(grid, grid_column, valuesObject) {
        this.grid         = grid
        this.grid_column  = grid_column
        this.valuesObject = valuesObject
    }
    RunInit() {
        this.AutoCompleteParams()
        this.AgRichSelectParams()
        this.DeleteUndoParams()
        this.SubGridParams()
    }

    AutoCompleteParams() {}
    AgRichSelectParams() {}
    DeleteUndoParams()   {}
    SubGridParams()      {}
    AgLargeTextParams() {}


}




module.exports = {'CustomCellParams': CustomCellParams}
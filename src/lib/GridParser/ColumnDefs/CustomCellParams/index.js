/*
Responsible for creating each columns rules for displaying and formatting the data.

grid: json array of the grid
grid_column:
valuesObject: the json array object for autocomplete and richselector.
*/

//import crud column
const crudColumn = require('./CrudColumn')
const data_config = require('../../../DataConfig')
const DateTimeParams = require('./date_time')
// let cellEditors = {
//     //customEditors have special formatting
//     'customEditors':    ['autoComplete',  'subGridSelector', 'agRichSelectCellEditor'],
//     'standardEditors' : ['agTextCellEditor', 'agLargeTextCellEditor', 'dateTimeSelector' ], //make popupTrue for agLargeTextCellEditor
//     'defaultEditor': 'agTextCellEditor'
// }

class CustomCellParams {
    //for main loader
    //grid is json object for aggrid
    //allowNull (prepends value?)

    //valuesArray created by grid_func mix in?
    constructor(grid, gridValuesObject) { //gridValuesObject = valuesObject[position_index]
        this.grid         = grid
        this.valuesObject = valuesObject
    }
    RunInit() {

        for(let i=0; i < this.grid.length; i++) {
            let cE = this.grid_column['cellEditor'] || "agTextCellEditor"
            if (cE === "agTextCellEditor") { return }
            else if ( cE  === "autoComplete" ) {
                this.AutoCompleteParams()
            } else if (cE === 'agLargeTextCellEditor') {
                AgLargeTextParams()
            } else if (cE === "agRichSelectCellEditor") {
                AgRichSelectParams() 
            } else if (cE === "dateTimeSelector") {
                DateTimeParams()
            } else if (cE === "subGridSelector") {
                this.SubGridParams()
            } else if (cE === "meta c") {
                continue
            }



        }
    }




}






module.exports = {'CustomCellParams': CustomCellParams}
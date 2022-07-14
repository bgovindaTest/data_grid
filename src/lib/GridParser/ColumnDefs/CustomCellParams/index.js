/*
Responsible for creating each columns rules for displaying and formatting the data.

grid: json array of the grid
grid_column:
valuesObject: the json array object for autocomplete and richselector with field

// let cellEditors = {
//     //customEditors have special formatting
//     'customEditors':    ['autoComplete',  'subGridSelector', 'agRichSelectCellEditor'],
//     'standardEditors' : ['agTextCellEditor', 'agLargeTextCellEditor', 'dateTimeSelector' ], //make popupTrue for agLargeTextCellEditor
//     'defaultEditor': 'agTextCellEditor'
// }

*/

//import crud column
const crudColumn = require('./CrudColumn')
const data_config = require('../../../DataConfig')
const DateTimeParams = require('./date_time')
const AutoCompleteParams = require('./autocomplete_params')
const LargeTextParams = require('./largeText')
const AgRichParams = require('./agrich_params')
const SubGrid      = require('./subgrid')

class CustomCellParams {
    //for main loader
    //grid is json object for aggrid

    //valuesArray created by grid_func mix in?
    constructor(gridColumn, gridColumnValuesObject) { //gridValuesObject = valuesObject[position_index][field]
        this.grid_column         = gridColumn
        this.valuesObject        = gridColumnValuesOjbect
    }
    RunInit() {
        let grid_column  = this.grid_column
        let valuesObject = this.valuesObject
        let field = this.grid_column['field']
        let cE = this.grid_column['cellEditor'] || "agTextCellEditor"
        if (cE === "agTextCellEditor") { return }
        else if ( cE  === "autoComplete" ) {
            let x = new AutocompleteParams(grid_column, valuesObject)
            x.AutoCompleteParamsInit()
        } else if (cE === 'agLargeTextCellEditor') {
            let x = new LargeTextParams(grid_column)
            x.LargeTextInit()
        } else if (cE === "agRichSelectCellEditor") {
            let x = new AgRichParams(grid_column, valuesObject)
            x.AgRichSelectParamsInit() 
        } else if (cE === "dateTimeSelector") {
            let x = new DateTimeParams(grid_column)
        } else if (cE === "subGridSelector") {
            let x = new SubGrid()
            //run init  this.SubGridParams()
        } else if (cE === data_config.meta_column_name) {
            return
        } else {
            console.error(`invalid cellEditor ${cE} for field ${field}`)
        }
    }
}

module.exports = {'CustomCellParams': CustomCellParams}
/*
For large text set width and height when editing

// columnDefs: [
//     {
//         cellEditor: 'agLargeTextCellEditor'
//         cellEditorPopup: true,
//         cellEditorParams: {
//             maxLength: 100,
//             rows: 10,
//             cols: 50
//         }
//     }
// ]

*/

const auxFuncs = require('./auxilary_funcs')
const CellEditorParamsCheck = auxFuncs['CellEditorParamsCheck']

class LargeTextParams {
    constructor (grid_column) {
        this.grid_column = grid_column
    }
    LargeTextInit() {
        let maxLength = 100
        let rows = 10
        let cols = 50
        if (! this.grid_column.hasOwnProperty('cellEditorParams')) {
            let cep =  {} 
            cep['maxLength'] = maxLength
            cep['rows'] = rows
            cep['cols'] = cols
            this.grid_column['cellEditorParams'] = cep
        } else {
            let cep = this.grid_column['cellEditorParams']
            if (!cep.hasOwnProperty('maxLength') ) { cep['maxLength'] = maxLength }
            if (!cep.hasOwnProperty('rows') ) { cep['rows'] = rows }
            if (!cep.hasOwnProperty('cols') ) { cep['cols'] = cols }
        }
    }
}

module.exports = LargeTextParams
/*

2.) agRichSelectCellEditor

cellEditor: 'agRichSelectCellEditor',
cellEditorParams: {
    values: ['Male', 'Female'],
    allowNull: prepends null value to beginning of values array
    cellEditorPopup: true,
    pushKey: =  //defaults to field
    pullKey: =  //defaults to id //pullAndDisplay same key
    displayKey: //defaults to id (this goes into values)
    api: url_string
    mapObject: {key: value} takes select value and returns other value for crud
        mapObject[rowData['field] ] = {pushKey: pull_id}
   },
},

*/

const type_check = require('../../../TypeCheck')
const pushPullInit = require('./pushPullDisplay')


class CustomEditor {
    //for main loader
    //grid is json object for aggrid
    //allowNull (prepends value?)

    //valuesArray created by grid_func mix in?
    constructor(grid_column, valuesObject) {
        this.grid_column  = grid_column
        this.valuesObject = valuesObject
    }

    AgRichSelectParams() {
        /*
        This creates the values and mapObject for the dropdown 

        */
        let grid_column  = this.grid_column
        pushPullInit(grid_column)
        let valsParams = this.ValuesAgRichSelectParams()
        cep['values'] = valsParams['values']
        cep['mapObject'] = valsParams['mapObject']
    }
    ValuesAgRichSelectParams() {
        /*
        Parses values object and returns values for drop down and the map object.
        The map object 
         object.
            //key value
            //displayKey must be unique. maps to mapsObject.
            //pushKey is name of key to send
            //pullKey is name sent by columns lookup
        */
        let valuesObject = this.valuesObject
        let values = []
        let mapObject = {}
        let displayKey = this.grid_column['cellEditorParams']['displayKey']
        let pushKey = this.grid_column['cellEditorParams']['pushKey']
        let pullKey = this.grid_column['cellEditorParams']['pullKey']

        if (this.grid_column['cellEditorParams']['allowNull'] || false ) {
            values.push(null)
            let y = {}
            y[pushKey] = null
            mapObject[null] = y
        }

        for(let i=0; i<valuesObject.length; i++) {
            let x = valuesObject[i]
            let pull_id = x[pullKey]
            let y = {}
            y[pushKey] = String(pull_id)

            mapObject[displayKey] = y // {'id: 1} -> {'user_id': 1}
            values.push(displayKey)
        }
        return {'values': values, 'mapObject': mapObject}
    }

}




module.exports = {'CustomEditor': CustomEditor}
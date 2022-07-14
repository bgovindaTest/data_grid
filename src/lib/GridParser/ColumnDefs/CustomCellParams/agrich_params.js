/*
1.) agRichSelectCellEditor
valuesObject gets passed into initializer


cellEditor: 'agRichSelectCellEditor',
cellEditorPopup: true,
isLookup: true,
cellEditorParams: {
    values: ['Male', 'Female'],
    allowNull: prepends null value to beginning of values array
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
const auxFuncs = require('./auxilary_funcs')
const PushPullInit = auxFuncs['PullPushDisplayKeys']
const CellEditorParamsCheck = auxFuncs['CellEditorParamsCheck']



class AgRichParams {
    //for main loader
    //grid is json object for aggrid
    //allowNull (prepends value?)

    //valuesArray created by grid_func mix in?
    constructor(grid_column, valuesObject) {
        this.grid_column  = grid_column
        this.valuesObject = valuesObject
    }

    AgRichSelectParamsInit() {
        /*
            This creates the values and mapObject for the dropdown
        */
        let grid_column  = this.grid_column
        PushPullInit(grid_column)
        CellEditorParamsCheck(grid_column)
        grid_column['cellEditorPopup'] = true
        if (grid_column['isLookup'] || false ) {
            //if not hardcoded.
            let valsParams = this.ValuesAndMapObject()
            cep['values'] = valsParams['values']
            cep['mapObject'] = valsParams['mapObject']
            grid_column['isLookup'] = true


        } else {
            this.ValuesDropDown()
            grid_column['isLookup'] = false
        }

    }
    ValuesDropDown() {
        let values = []
        let valuesObject = this.valuesObject
        let displayKey = this.grid_column['cellEditorParams']['displayKey']
        let pushKey = this.grid_column['cellEditorParams']['pushKey']
        let pullKey = this.grid_column['cellEditorParams']['pullKey']

        if (type_check.IsJson(valuesObject) ) {
            if (this.grid_column['cellEditorParams']['allowNull'] || false ) { values.push(null) }
            for(let i=0; i<valuesObject.length; i++) {
                let x = valuesObject[i]
                let dk = x[displayKey]
                let pull_id = x[pullKey]
                let y = {}
                y[pushKey] = String(pull_id)
                mapObject[dk] = y // {'id: 1} -> {'user_id': 1}
                values.push(dk)
            }
        } else if ( type_check.IsArray(valuesObject) ) {
            if (this.grid_column['cellEditorParams']['allowNull'] || false ) { values.push(null) }
            for(let i=0; i<valuesObject.length; i++) {
                let x = valuesObject[i]
                let dk = x[displayKey]
                values.push(dk)
            }
        }
        let cep = this.grid_column['cellEditorParams']
        cep['values']    =  values
        cep['mapObject'] =  mapObject

    }



    ValuesAndMapObject() {
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
            let dk = x[displayKey]
            let pull_id = x[pullKey]
            let y = {}
            y[pushKey] = String(pull_id)
            mapObject[dk] = y // {'id: 1} -> {'user_id': 1}
            values.push(dk)
        }
        let cep = this.grid_column['cellEditorParams']
        cep['values']    =  values
        cep['mapObject'] =  mapObject
    }

}




module.exports = AgRichParams
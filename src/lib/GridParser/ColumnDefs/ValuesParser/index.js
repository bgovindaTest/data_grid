/*
For parsing valueSetter, valueGetter, valueFormatter, validator. Default assumes expression string.
Will also accept function. Use object to specify other options.

    valueGetter: 
    valueSetter: (optional) (grid_rules_object). Need to add for date column?
    valueFormatter: blah
    toolTip: expression for variables
    validator: expression or function


    //special Information for etc.
    allowNull: true/false
    isRequired: true/false
    ignoreError: true/false (for calculated fields?) allow to pass or skip?
    typeCheckError? if true dont remove invalid data type.
        //show as error instead?. dont run validation if error. not implemented yet would
        //also have to add for xyz

//not implemented yet also need try catch console log error.
requiredFields: []
validatorRequiredFields: [] //must all be not null or will not run. returns null in that case
valueGetterRequiredFields: [] //must all be not null or will not run. returns null in that case
requiredFieldsTypeCheck: true //unchangeage
nullReplace: true


    Responsible for creating valueGetter, valueSetter and valueFormatter
    default is expression syntax string.
    if object options are {'string': string_value}, {'function': js_function} {'expression': expression string}
        or function

    grid_column: columnDef to be parsed
    globals: object containing global variables and parameters
*/

const ex          = require('../../ExpressionParser')
const type_check  = require('../../../TypeCheck')
const data_config = require('../../../DataConfig')

class ValuesParaser {
    constructor(grid_column,  globals) {
        this.grid_column = grid_column
        this.globals = globals
    }
    RunInit() {
        let grid_column = this.grid_column
        this.ValueTransform(grid_column, 'valueGetter')
        this.ValueTransform(grid_column, 'valueSetter')
        this.ValueTransform(grid_column, 'valueFormatter')
        this.ValueTransform(grid_column, 'toolTip')
        this.Validators(grid_column)
        this.ValueSetter(grid_column)
    }

    ValueTransform(grid_column, parameter_name) {
        /*
        Adds valueGetter, valueSetter, valueFormatter and toolTip. by default assumes is
        an expression. if Navtive is used i.e. valueGetterNative. the value is passed to 
        valueGetter with the native value.
        */
        if (! grid_column.hasOwnProperty(parameter_name)) { return }
        let vt = grid_column[parameter_name]

        if (type_check.IsString(vt) ) {
            let expr = grid_column[parameter_name]
            let options = this.OptionsParser(grid_column)
            grid_column[parameter_name] = ex.CreateAggridFunction(expr, globalx, options)
        } 
        else if (type_check.IsFunction(vt) ) { return }
        else if (type_check.IsObject(vt)) {
            if ( vt.hasOwnProperty('string') ) { grid_column[parameter_name] = vt['string'] } 
            else if ( vt.hasOwnProperty('function') ) { grid_column[parameter_name] = vt['function'] } 
            else if ( vt.hasOwnProperty('expression')) {
                let expr = vt['expression']
                let options = this.OptionsParser(grid_column)
                grid_column[parameter_name] = ex.CreateAggridFunction(expr, globalx, options)
            }
        }
        else {
            let field = grid_column['field'] || 'field error'
            let pn    = parameter_name || 'parameter_name error'
            let expx  = String(vt)
            console.log(`value transform error ${field} ${pn} ${expx}`)
        }
    }
    Validators(grid_column) {
        //creates validation function for aggrid cell
        if( ! grid_column.hasOwnProperty('validator') ) {return}
        let globalx = this.globals
        let v = grid_column.hasOwnProperty('validator')
        if (type_check.IsFunction(v) ) { return }

        if (type_check.IsString(v) ) {
            let expr = grid_column['validator']
            let options = this.OptionsParser(grid_column)
            grid_column['validator'] = ex.CreateAggridFunction(expr, globalx, options)
        }
    }
    ValueGetter(grid_column) { 
        //special valueGetters are set in cell edtiro
    }
    OptionsParser(grid_column) {
        //aditional options present in
        // if (options.hasOwnProperty['requiredFields'] ) { requiredFields = options['requiredFields'] }
        let options = {}
        if (grid_column.hasOwnProperty('dataType')) {
            let dx = grid_column['dataType'].toLowerCase()
            if (dx.includes('big')) { options['mathjs_type_set'] = 'big' }
        }
        if (grid_column.hasOwnProperty('requiredFields')) { options['requiredFields'] = grid_column['requiredFields'] }
    
        return options
    }

    ValueSetter(grid_column) {
        /*
        Adds value setter for default types
        to numbers and date. If not correct format return null

        */

        //if read only. will shouldnt require. valueSetter should never file?

        if (grid_column.hasOwnProperty('valueSetter')) {return}
        let custom_editors = data_config['cellEditors']['customEditors']
        let grid_editor = grid_column['cellEditor'] || ""
        /*
        If no cellEditor and editalbe is false or not avaialbe continue
        */
        if (custom_editors.includes(grid_editor)) {return } //ignore custom editors

        //if is customEditor return


        let field = grid_column['field']

        //numbers
        let number_types = data_config.number_types

        if (number_types.includes(grid_column['dataType'])) { 
            grid_column['valueSetter'] = this.NumberSetter(field)
        } else if ('date' === grid_column['dataType']) {
            grid_column['valueSetter'] = this.DateSetter(field)
        } else if ('datetime' === grid_column['dataType'] || 'timestamp' === grid_column['dataType'] ) {
            
        } else if ('time' === grid_column['dataType'] ) {
            //hh:mm:ss 19:37:35
        }
        //timestampe
    }
    //checks if value is right type or returns null
    NumberSetter (field) {
        let fn = function (params) {
            if (! type_check.IsNumber(params.newValue) ) {
                params.data[field] = null
                return true
            }
            else {
                params.data[field] = params.newValue
                return true
            }
        }
        return fn
    }
    DateSetter (field) {
        let fn = function (params) {
            if (! type_check.IsDate(params.newValue) ) {
                params.data[field] = null
                return true
            }
            else {
                //type cast?
                params.data[field] = params.newValue
                return true
            }
        }
        return fn
    }
    IntegerSetter (field) {
        let fn = function (params) {
            if (! type_check.IsNumber(params.newValue) ) {
                params.data[field] = null
                return true
            }
            else {
                params.data[field] = params.newValue
                return true
            }
        }
        return fn
    }
    TimeSetter() {}
    DateTimeSetter() {}
}
// this.ValueTransform(grid_column, 'valueGetter')
// this.ValueTransform(grid_column, 'valueSetter')
// this.ValueTransform(grid_column, 'valueFormatter')
// this.ValueTransform(grid_column, 'toolTip')
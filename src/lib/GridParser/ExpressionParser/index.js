/*
This module handles converting string expression syntax into javascript functions

Handles function processing

If dealing with large number CreateFunction requires big parameter

How to handle required fields and type checks

Need error checking.

//not implemented yet also need try catch console log error.
requiredFields: []
validatorRequiredFields: [] //must all be not null or will not run. returns null in that case
valueGetterRequiredFields: [] //must all be not null or will not run. returns null in that case


*/
const data_config = require ('../../DataConfig')
const type_check = require('../../TypeCheck')
const mathjs     = require('mathjs')
const create     = mathjs['create']
const all        = mathjs['all']

const math = create(all)
const math_big = create(all)

//initialize big number configuration
math_big.config({ number: 'BigNumber', precision: 64 })

function ifnull(x, alt_x) {
    /*
    Returns alternative value if x is null
    */
    if (type_check.IsNull(x) || type_check.IsUndefined(x) ) {return alt_x}
    return x
}

function nullcast(x, data_type) {
    /*
    Returns default value of data type if values is null or undefined
    */
    if (type_check.IsNull(x) || type_check.IsUndefined(x) ) {
        return type_check.NullTypeCast( x , data_type  )
    }
    return x
}


function lookup(lookup_column, lookup_field) {
    /*
    Returns lookup column is the object stored in the column i.e. {}
    lookup_field is the key.

    may add type casting.
    */
    if (type_check.IsNull(lookup_column))      { return null}
    if (! type_check.IsObject(lookup_column) ) { return null}
    if (lookup_column.hasOwnProperty(lookup_field)) {
        return lookup_column[lookup_field] 
    } else {
        console.error(`lookup field ${lookup_field} missing for column object ${lookup_column} `)
        return null
    }

}




function CreateScopeObject (params, globals) {
    /*
        Creates scope object for function call. Contains all variables required
        for function to execute. params is the object passed from aggrid.
    */
    let params_data = params.data
    let scopex = {}
    let params_keys = Object.keys(params_data)
    for (var i=0; i < params_keys.length; i++) {
        scopex[params_keys[i]] = params_data[ params_keys[i] ]
    }
    // console.log(globals)
    let keys = Object.keys(globals)
    for (var i=0; i < keys.length; i++) {
        scopex[keys[i]] = globals[ keys[i] ]
    }
    return scopex
}


function CreateFunction(expression, mjx_type=null) {
    /*
    Compiles expression. Returns function
    */

    let mx = math
    if (mjx_type === 'big' ) {
        mx = math_big
    }
    return mx.compile(expression)
}



function EvaluateFunction(fn, params, globals, requiredFields) {
    /*
        Takes values from params.data and globals object to create scoped object.
        The scoped object is passed to the function for evaluation.
        params: from aggrid
    */
    try {
        if (requiredFields.length > 0) {
            if(! HasRequiredFields(params.data, requiredFields)) {return null}
        }

        let scope = CreateScopeObject(params, globals)
        return fn.evaluate(scope)
    } catch (error) {
        console.error(error)
        return null
    }
}

function CreateAggridFunction( expr, globals, options ) {
    /*
    This creates the function called by aggrid.
    expr: exprssion string thats parsed into a function
    globals: object for passing global information into function
    options: special flags.
        math_type_set determines if numbers ares stored as regualar javascript number type
            or big type.
        requiredFields: list of fields that must be not null.
    */

    let mathjs_type_set = null
    if (options.hasOwnProperty['mathjs_type_set'] ) { mathjs_type_set = options['mathjs_type_set'] }
    let requiredFields = options['requiredFields'] //validatorRequired fields or valueGetterRequired fields passed in options in valueParser


    let fx = CreateFunction(expr, mathjs_type_set )
    let fn = function (params) {
        try{
            let res = EvaluateFunction(fx, params, globals, requiredFields)
            return res
        } catch (error) {
            console.error(error)
            return null
        }
    }
    return fn
}


function HasRequiredFields(rowData, requiredFields) {
    /*
        Checks if all required fields are not null in rowData object
        if any are null returns false
    */
    for (let i =0; i < requiredFields.length; i++) {
        let rf = requiredFields[i]
        if (! rowData.hasOwnProperty(rf)) {
            console.error(`${rf} not in rowData object`)    
            return false
        }
        if (type_check.IsNull(rowData[rf])) {return false}
        else if ( type_check.IsUndefined(rowData[rf]) ) {return false}
    }
    return true
}


function GridColumnRequiredFields(grid_column) {
    /*
    This assembles the required fields. validators and valueGetters wont fire if values are null.
    This is called in ValueParser to add required fields

    requiredFields: []
    validatorRequiredFields: [] //must all be not null or will not run. returns null in that case
    valueGetterRequiredFields: [] //must all be not null or will not run. returns null in that case

    */
    let tmp = []
    if (grid_column.hasOwnProperty('requiredFields')) {
        let rf = grid_column['requiredFields']
        if (! type_check.IsArray(rf)) {
            grid_column['requiredFields'] = []
        } else {
            for(let i =0; i < rf.length; i++) {
                tmp.push(rf[i])
            }
        }
    }
    //validator required fields
    if (! grid_column.hasOwnProperty('validatorRequiredFields')) {
        grid_column['validatorRequiredFields'] = tmp
    } else {
        if (! type_check.IsArray(grid_column['validatorRequiredFields'])) {
            grid_column['validatorRequiredFields'] = []
        }
    }
    //valueGetterRequiredFields
    if ( ! grid_column.hasOwnProperty('valueGetterRequiredFields') ) {
        grid_column['valueGetterRequiredFields'] = tmp
    } else {
        if (! type_check.IsArray(grid_column['valueGetterRequiredFields'])) {
            grid_column['valueGetterRequiredFields'] = []
        }
    }

}

//user defined functions
function ImportFunctions(mathx) {
    mathx.import({
        "ifnull": ifnull,
        "lookup": lookup,
        'nullcast': nullcast,
        'isobject': type_check.IsObject,
        'isstring': type_check.IsString,
        'isarray': type_check.IsArray,
        'isboolean': type_check.IsBoolean,
        'isnumber': type_check.IsNumber,
        'isbasictype': type_check.IsBasicType,
        'isnull': type_check.IsNull,
        'isinteger': type_check.IsInteger,
        'isdate': type_check.IsDate,
        'istime': type_check.IsTime,
        'isdatetime': type_check.IsDateTime,
        'istimestamp': type_check.IsDateTime,
        'isundefined': type_check.IsUndefined
    })
}


function DeactivateInsecureFunctions(mathx) {
    //need to call after grid initialization?
    //removes injectable attack functions
    mathx.import({
        import: function () { throw new Error('Function import is disabled') },
        createUnit: function () { throw new Error('Function createUnit is disabled') },
        evaluate: function () { throw new Error('Function evaluate is disabled') },
        parse: function () { throw new Error('Function parse is disabled') },
        simplify: function () { throw new Error('Function simplify is disabled') },
        derivative: function () { throw new Error('Function derivative is disabled') }
      }, { override: true })
}

//adds user defined functions
//may need to call these functions later
ImportFunctions(math)
ImportFunctions(math_big)
DeactivateInsecureFunctions(math)
DeactivateInsecureFunctions(math_big)


module.exports = {
    "CreateScopeObject": CreateScopeObject,
    "CreateFunction": CreateFunction,
    "EvaluateFunction":EvaluateFunction,
    "CreateAggridFunction": CreateAggridFunction,
    "GridColumnRequiredFields": GridColumnRequiredFields,
}

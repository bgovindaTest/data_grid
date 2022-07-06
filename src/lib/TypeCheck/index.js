const data_config = require('../DataConfig')
const null_conversion = data_config['null_conversion']

const number_types  = data_config['number_types']
const integer_types = data_config['integer_types']
const serial_types = data_config['serial_types']
const text_types   = data_config['text_types']
const date_types   = data_config['date_types']
const object_types = data_config['object_types']
const moment = require('moment')


//TypeChecking
function IsObject (x) {
    if (typeof x === 'object' && !Array.isArray(x) && x !== null ) { return true }
    else { return false}
}

function IsString (x) {
    if (typeof x === 'string' || x instanceof String) {return true}
    else { return false }
}

function IsInteger(x) {
    if (Number.isInteger(x)) {return true}
    else if (String(x).match(/^-?(0|[1-9]\d*)$/) != null ) {return true}
    return false
}

function IsNull(x) {
    if (x === null) {return true}
    else{ return false }
}

function IsUndefined(x) {
    if (typeof x === 'undefined') { return true }
    else { return false }
}

function IsFunction(x) {
    if (typeof x === 'function') { return true }
    else { return false }
}

function IsNumber (x) {
    //https://stackoverflow.com/questions/2811031/decimal-or-numeric-values-in-regular-expression-validation
    if (typeof x == "number") { return true }
    else if (String(x).match(/^-?(0|[1-9]\d*)?(\.\d+)?(?<=\d)$/) != null) {return true}
    else { return false}
}

function TextIsNumber(x) {
    if (String(x).match(/^-?(0|[1-9]\d*)?(\.\d+)?(?<=\d)$/) != null) {return true}
    else { return false}
}

function IsArray (x) {
    return Array.isArray(x)    
}

function IsBasicType(x) {
    if (IsBoolean(x) || IsString(x) || IsNumber(x)) {return true}
    else { return false }
}

function IsJsonArray(x) {
    if (! IsArray(x)) { return false }
    if (x.length === 0) {return true}
    let ox = x[0]
    if (! IsObject(ox) ) { return false }
    else {return true}
}

function IsBoolean (x) {
    let bool_values = ['t','true','y','yes','on','1','TRUE', 'FALSE','f','n','no','off','0']
    if ( bool_values.includes(String(x) ) ) {return true}
    else { return false}
}

let dateFormats = ['YYYY-MM-DD','YYYY-M-DD','YYYY-MM-D','YYYY-M-D', 'MM/DD/YYYY','M/DD/YYYY','MM/D/YYYY','M/D/YYYY']
let h = ['HH', 'H']
let m = ['mm', 'm', '']
let s = ['sss', 'ss', 's', '']
let timeFormats = []
for( let i=0; i< s.length; i++) {
    for (let j=0; j< m.length ; j++) {
        for(let k=0; k< h.length; k++) {
            let ts = [h[k]]
            if (m[j] != "") {
                ts.push(m[j])
                if (s[i] != "") { ts.push(s[i]) }
            }
            timeFormats.push(ts.join(':'))
        }
    }
}

function IsDate(x) {
    //only checks for single value. No array conversion
    var date_formats = dateFormats
    var moment_date = moment(x, date_formats, true)
    if (moment_date.isValid()) { return true } 
    else { return false }
}

function IsTime(x) {
    //only checks for single value. No array conversion
    var time_formats = timeFormats
    var moment_time = moment(x, time_formats, true)
    if (moment_time.isValid()) { return true } 
    else { return false }
}

function IsDateTime(x) {
    let ds  = String(x).trim()
    let dz  = ds.split(/\s+/)
    if (dz.length > 2) { return false }
    if (dz.length === 2) {
        return IsDate(dz[0]) && IsTime(dz[1])
    }
    return false
}

let truthy = ['t','true','y','yes','on','1','TRUE', true, 1]
let falsey = ['FALSE','f','n','no','off','0', 'false', false, 0]
function TypeCastBoolean(bool_val) {
    if (truthy.includes(bool_val)) {return 'true'}
    if (falsey.includes(bool_val))  {return 'false'}
    return null
}

function TypeCastNumber(num_val) {
    if (IsNumber (num_val)) {return String(num_val) }
    return null
}

function TypeCastString(val) {
    if (IsString(val)) {return val}
    return null
}

function TypeCastDateTime(date_time_val) {
    let dz  = date_time_val.split(/\s+/)
    if (dz.length != 2) {return null}
    let date_val = dz[0]
    let time_val = dz[1]
    try {
        let ds = TypeCastDate(date_val)
        let ts = TypeCastTime(time_val)
        if (!IsTime(ts) || !IsDate(ds) ) {return null}
        return ds + " " + ts
    } catch {
        return null
    }
}

function TypeCastDate(date_val) {
    let date_formats = dateFormats
    try {
        let moment_date = moment(date_val, date_formats, true)
        if (moment_date.isValid()) {
            return moment_date.format('YYYY-MM-DD')
        } else {return null}

    } catch {
        return null
    }

}

function TypeCastTime(time_val) {
    let time_formats = timeFormats
    try {
        let moment_time  = moment(time_val, time_formats, true)
        if (moment_time.isValid()) {
            return moment_time.format('HH:mm:ss')
        } else {return null }

    } catch {
        return null
    }

}

function TypeValid(val, data_type) {
    /*
    Return true if value is of the right type
    */
    if (integer_types.includes(data_type))     { return IsInteger(val) } 
    else if (number_types.includes(data_type)) { return IsNumber(val) } 
    else if ( text_types.includes(data_type) ) { return IsString (val) } 
    else if ( date_types.includes(data_type) ) {
        if (data_type === 'date') { return IsDate(val) }
        else if (['datetime','timestamp', 'timestampz'].includes(data_type)  ) {return IsDateTime(val)}
        else if (data_type === 'time') { return IsTime(val)}
        else {return false}
    } else if ( object_types.includes(data_type) ) {
        if (data_type === 'array') { return IsArray(val)}
        else if (data_type === 'object') { return IsObject(val)}
        else { return false }

    } else if ( serial_types.includes(data_type) ) { return IsNumber(val) }
    else {return false}
}

function NullTypeCast( value, data_type  ) {
    /*
    If null return value for null values. Used as default value
    If invalid data_type return null

    i.e. if datatype is integer and has null value returns 0.
    Allows for calculations to proceed. null returned for dates and times.
    */

    if (IsNull(value) || IsUndefined(value) ) {
        if (null_conversion.hasOwnProperty(data_type)) {
            return null_conversion[data_type]
        }
        console.error(`value ${value} and data_type ${data_type} did not cast to non null value`)
        return null
    } else {
        return value
    }
}

module.exports = {
    'IsObject': IsObject,
    'IsString': IsString,
    'IsArray': IsArray,
    'IsBoolean': IsBoolean,
    'IsNumber': IsNumber,
    'IsBasicType': IsBasicType,
    'IsNull': IsNull,
    'IsInteger': IsInteger,
    'IsFunction': IsFunction,
    'IsDate': IsDate,
    'IsTime': IsTime,
    'IsDateTime': IsDateTime,
    'IsJsonArray': IsJsonArray,

    'TextIsNumber': TextIsNumber,
    'IsUndefined': IsUndefined,

    //TypeCast
    'TypeCastBoolean': TypeCastBoolean,
    'TypeCastDate': TypeCastDate,
    'TypeCastTime': TypeCastTime,
    'TypeCastDateTime': TypeCastDateTime,
    'NullTypeCast': NullTypeCast,
    'TypeValid': TypeValid,
    'TypeCastNumber': TypeCastNumber,
    'TypeCastString': TypeCastString
}
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
    if (typeof x === undefined) { return true }
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

function IsBoolean (x) {
    let bool_values = ['t','true','y','yes','on','1','TRUE', 'FALSE','f','n','no','off','0']
    if (typeof x == "boolean") { return true }
    else if (String(x) in bool_values ) {return true}
    else { return false}
}

let dateFormats = ['YYYY-MM-DD','YYYY-M-DD','YYYY-MM-D','YYYY-M-D', 'MM/DD/YYYY','M/DD/YYYY','MM/D/YYYY','M/D/YYYY']
let h = ['HH', 'H']
let m = ['MM', 'M']
let s = ['SSS', 'SS', 'S']
let timeFormats = []
for( let i=0; i< s.length; i++) {
    for (let j=0; j< m.length ; j++) {
        for(let k=0; k< h.length; k++) {
            let ts = h[k] +":"+m[j] +":"+s[i]
            timeFormats.push(ts)
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
    var moment_date = moment(x, time_formats, true)
    if (moment_date.isValid()) { return true } 
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

// var dateTime = moment(date + ' ' + time, 'DD/MM/YYYY HH:mm');
// console.log(dateTime.format('YYYY-MM-DD HH:mm'))


let truthy = ['t','true','y','yes','on','1','TRUE']
let falsey = ['FALSE','f','n','no','off','0']
function TypeCastBoolean(bool_val) {
    if (truthy.includes(bool_val)) {return 'true'}
    if (false.includes(bool_val))  {return 'false'}
    else 'false'
}

function TypeCastDateTime(date_val, time_val) {
    let ds = TypeCastDate(date_val)
    let ts = TypeCastTime(time_val)
    return ds + " " + ts
}

function TypeCastDate(date_val) {
    let date_formats = dateFormats
    let moment_date = moment(date_val, date_formats, true)
    return moment_date.format('YYYY-MM-DD')
}

function TypeCastTime(time_val) {
    let time_formats = timeFormats
    let moment_time  = moment(time_val, time_formats, true)
    return moment_time.format('HH:MM:SSS')
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


    'TextIsNumber': TextIsNumber,
    'IsUndefined': IsUndefined,

    //TypeCast
    'TypeCastBoolean': TypeCastBoolean,
    'TypeCastDate': TypeCastDate,
    'TypeCastTime': TypeCastTime,
    'TypeCastDateTime': TypeCastDateTime
}
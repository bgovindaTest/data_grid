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

function IsDate(x) {
    //only checks for single value. No array conversion
    var date_formats = ['YYYY-MM-DD','YYYY-M-DD','YYYY-MM-D','YYYY-M-D', 'MM/DD/YYYY','M/DD/YYYY','MM/D/YYYY','M/D/YYYY']
    var moment_date = moment(x, date_formats, true)
    if (moment_date.isValid()) { return true } 
    else { return false }
}

function ParseDate (datestr, format) {
    // console.log(datestr, format)
    let dx = TypeCastDate(datestr, format)
    // return datestr
    return dx
}

function ParseBoolean() {}
function ParseLookup () {}

function TypeCastDate(date_val, format_string) {
    var date_formats = ['YYYY-MM-DD','YYYY-M-DD','YYYY-MM-D','YYYY-M-D', 'MM/DD/YYYY','M/DD/YYYY','MM/D/YYYY','M/D/YYYY']
    var moment_date = moment(date_val, date_formats, true)
    return moment_date.toDate()
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
    'IsUndefined': IsUndefined,
    'ParseDate': ParseDate
}
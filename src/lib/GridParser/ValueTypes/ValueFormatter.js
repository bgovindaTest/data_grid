/*
valueFormatter functions

used to change how data is displayed to user.
*/

const moment = require('moment')

function ValueDateTimeFormatter (params) {

    if (params.value === null) {return params.value}
    let dateAsString = params.value
    dateAsString = moment(moment( dateAsString))
    if (! dateAsString.isValid() ) {return null}

    dateAsString = dateAsString.format('MM/DD/YYYY HH:mm:ss')
    return dateAsString

}

function ValueNumberFormatter (params) {

    if (params.value === null) {return ""}
    return String(params.value)

}

module.exports = {
    'ValueDateTimeFormatter': ValueDateTimeFormatter,
    'ValueNumberFormatter': ValueNumberFormatter
}
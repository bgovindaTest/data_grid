/*
Sets configurations for date time picker. The configuration used is dependant on the
date type. valid types are date, time, datetime or timestamp
default date is date

parseDate is handled by valueSetter
// {
//   altInput: true,
//   dateFormat: "YYYY-MM-DD", for dateTime YYYY-MM-DD HH:MM:SSS
//   altFormat: "YYYY-MM-DD",
//   allowInput: true,
//   parseDate: (datestr, format) => {
//     return moment(datestr, format, true).toDate();
//   },
//   formatDate: (date, format, locale) => {
//     // locale can also be used
//     return moment(date).format(format);
//   }
//  swap between date and datetime format?
// }

//week number

//ISO Date format


week_number
enableTime
enableSeconds
range
allowInvalidPreload

to create a time picker
noCalendar
enableTime

parseDates not needed handled by valueSetter.
*/
const type_check  = require('../../../TypeCheck')
const data_config = require('../../../DataConfig')


class DateTimeParams {
  constructor (grid_column) {
    this.grid_column = grid_column
  }
  DateTimeInit() {
    this.SetDefaults()
    let data_type = this.grid_column['dataType']
    if (data_type === 'date') { this.DateConfig()} 
    else if (data_type === 'time') { this.TimeConfig() } 
    else { this.DateTimeConfig() }
  }
  DateConfig() {
    let cep = this.grid_column['cellEditorParams']
    if (!cep['dateFormat']) {cep['dateFormat'] = 'YYYY-MM-DD'}
  }

  DateTimeConfig() {
    let cep = this.grid_column['cellEditorParams']
    if (!cep['dateFormat']) {cep['dateFormat'] = 'YYYY-MM-DD HH:MM:SSS'}
  }
  TimeConfig() {
    let cep = this.grid_column['cellEditorParams']
    if (!cep['dateFormat']) {cep['dateFormat'] = 'HH:MM:SSS'}
    this.SetTimeDefault()
    if (!cep['noCalendar']) {cep['noCalendar'] = true}
  }


  SetDefaults() {
    let cep = this.grid_column['cellEditorParams']
    if (! this.grid_column.hasOwnProperty('dataType') ) {
      this.grid_column['dataType'] = 'date'
    }
    if (!cep['allowInput']) {cep['allowInput'] = true}
  }
  SetTimeDefault() {
    if (!cep['enableTime']) {cep['enableTime'] = true}
    if (!cep['enableSeconds']) {cep['enableSeconds'] = true}
  }
}


module.exports = DateTimeParams
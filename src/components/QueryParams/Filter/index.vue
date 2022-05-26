<!--
The main filter module handles the display and where component for the queries. The where object and where modal object are initialized by query_params.js

The values stored in where are processed and stored in get_route_params. This object is used to help create the query params for the server.

let cn = where_statements[i].column_name
let cv = where_statements[i].value
let op = where_statements[i].operator

//value is data_type or array?

{'in':[values]} //if from json string use 
{'not_in':[values]}
{'lt':value}
{'gt':value}
{'between':[values]} //must contain 2 values
{'not_between':[values]} //must contain 2 values
{'eq':value}
{'neq':value}


let valid_operators = {'=': '=', '!=': '!=', 
    '<>': '<>', '>':'>', '>=': '>=', 
    '<': '<', '<=': '<=', 
    
    'lt': '<', 'le':'<=' , 'gt': '>',
    'ge': '>=', 'eq': '=', 'neq': '!=',
    'in':'IN',
    'not_in': "NOT IN", 
    'similar': "SIMILAR TO", 'not_similar': "NOT SIMILAR TO",
    'like': "LIKE",  'not_like': "NOT LIKE", 'ilike': "ILIKE",
    'not_ilike': "NOT ILIKE",
    'between': "BETWEEN SYMMETRIC", 'not_between': "NOT BETWEEN SYMMETRIC" , 'is_null': "IS NULL", 
    'is_not_null': "IS NOT NULL",
    //create in statements with like and ilike 
    'like_in': "LIKE ANY", 'not_like_in': "NOT LIKE ALL",
    'ilike_in': "ILIKE ANY", 'not_ilike_in': "NOT ILIKE ALL",
}


boolean
number
text
date
datetime

-->
<template>
<div  >
<div class="container" >




  <div class='level'>
    <div class="levelLeft">
      <!-- filter selector -->
      <div class="dropdown" :class='{"is-active": dropdown_active}'>
        <div class="dropdown-trigger">
          <button class="button" aria-haspopup="true" aria-controls="dropdown-menu" @click="dropdown_active = !dropdown_active"
            @blur="dropdown_active=false"
          >
            <span>Select Filter</span>
            <span class="icon">
              <font-awesome-icon :icon="['fas', 'angle-down']" />
            </span>
          </button>
        </div>
        <div class="dropdown-menu" id="dropdown-menu" role="menu">
          <div class="dropdown-content">
            <a  v-for="(item, index) in columns" :key="index"  href="#" class="dropdown-item"  @mousedown="AddFilter(item)">
              <p  >{{item.column_name}}</p>
            </a>
          </div>
        </div>
      </div>


      <button class="button  ml-2 is-light" @click="DeleteRow()">Delete</button>
      <button class="button  ml-2 is-light" @click="ClearRows()">Clear</button>
    </div>

    <div class="levelRight">
      <button class="button is-small is-success" @click="Accept()">Accept</button>
      <button class="button is-small ml-2 is-danger" @click="Cancel()">Cancel</button>
    </div>
  </div>

  <div v-for="(item, index) in filters" :key=index > {{item.column_name}} </div>

  <!-- <template class="box"> -->
    <div class="control block">
      <label class="label">Email</label>
      <div class="select">
        <select>
          <option>Select dropdown</option>
          <option>With options</option>
        </select>
      </div>
    </div>
  <!-- </template> -->
  <div class="block">
        <label class="label mr-3" style="display: inline;">Input</label>
          <!--filter type -->
          <div class="select is-small">
            <select>
              <option>Select Filter</option>
              <option>With options Between All the data</option>
            </select>
          </div>
  </div>

    <input class="input" type="text" placeholder="Text input">
  <!-- </div> -->
  <textarea class="textarea block" placeholder="e.g. Hello world"></textarea>
  <flat-pickr ref="datePicker" v-model="date" class="input box" placeholder="Text input button" ></flat-pickr>



</div>
</div>
</template>

<script>


/*
variable_name
data_type
value

*/


import flatPickr from 'vue-flatpickr-component';
import moment from "moment"
// import 'flatpickr/dist/flatpickr.css';

function ParseDate (datestr, format) {
    // console.log(datestr, format)
    let dx = TypeCastDate(datestr, format)
    // return datestr
    return dx
}

function TypeCastDate(date_val, format_string) {
    var date_formats = ['YYYY-MM-DD','YYYY-M-DD','YYYY-MM-D','YYYY-M-D', 'MM/DD/YYYY','M/DD/YYYY','MM/D/YYYY','M/D/YYYY']
    var moment_date = moment(date_val, date_formats, true)
    if (moment_date.isValid()) {
        // return moment_date.format(format_string)
        return moment_date.toDate()
    } else {
        return false
    }
}



export default {

  components: { flatPickr },
  data() {
    return {
      dropdown_active: false,
      date: null,
      config: {
          allowInput: true,
          "parseDate": ParseDate
      },
      columns: [
        {'column_name': 'a', 'data_type': 'text'},
        {'column_name': 'b', 'data_type': 'date'},
        {'column_name': 'c', 'data_type': 'number'},
        {'column_name': 'd', 'data_type': 'boolean'},

      ],
      filters: [
        // {'column_name': 'a', 'operator': 'text', 'value': [null, null]} //second value only for between and not between
        // delimiter type?
      ]


    }


  },
  //before mount verify values columns is an array with length atleast 2.


  methods: {
    AddFilter (column_filter) {
      // console.log(column_filter)
      this.filters.push(column_filter)
      this.dropdown_active=false


    },
    RemoveFilter (index) {

    }
  }


  // props: {
  //   params: {
  //     // required: true,
  //     default: function () {return {'help_active': true, 'select_column': false} },
  //     type: Object
  //   },
  //   filters_list: {
  //     // required: true,
  //     default: function () {return [{}] },
  //     type: Array
  //   }
  // }
}






/*
DateValue, NumberValue, StringValue and BooleanValue are called by AddDataRulesToFilter. They are used to create the filter
rules object for each specified data type.

*/
//check if date valid? else null
function DateValue(filter_row, data_row) {
    //verify if default date is valid date
    var queryTypeList = ["before_on","equals","after_on","between","not_between"]
    var date_val = {'before_date': null, 'after_date': null}
    filter_row['data_type']  = 'date'
    filter_row['query_type'] = ""
    var date_formats = ['YYYY-MM-DD','YYYY-M-DD','YYYY-MM-D','YYYY-M-D', 'MM/DD/YYYY','M/DD/YYYY','MM/D/YYYY','M/D/YYYY']
    filter_row['value'] = date_val

    if (! data_row.hasOwnProperty('value') ) {return }
    var vx = data_row['value']
    if (vx === null) {return}
    if (typeof vx !== 'object') {return}

    if (vx.hasOwnProperty('after_date') ) {
        var afd = vx['after_date']
        var moment_date = moment(afd, date_formats, true)
        if (moment_date.isValid()) {
            date_val['after_date'] = moment_date.format('MM/DD/YYY')
        }
    }
    if (vx.hasOwnProperty('before_date') ) {
        var afd = vx['before_date']
        var moment_date = moment(afd, date_formats, true)
        if (moment_date.isValid()) {
            date_val['before_date'] = moment_date.format('MM/DD/YYY')
        }
    }
    if (data_row.hasOwnProperty('query_type') ) {
        if (queryTypeList.includes(data_row['query_type']) ) {
            filter_row['query_type'] = data_row['query_type']
        }  
    }

}

//check if object value exists. if not string set default ""
function StringValue(filter_row, data_row) {
    var queryTypeList = ["equals","in","not_in"]
    filter_row['data_type']  = "string"
    filter_row['query_type'] = ""
    filter_row['isComma'] = false

    if (data_row.hasOwnProperty('query_type') ) {
        if (queryTypeList.includes(data_row['query_type']) ) { 
            filter_row['query_type'] = data_row['query_type']
        }  
    }

    if (! data_row.hasOwnProperty('value') ) {
        filter_row['value'] = ""
        return
    } else {
        filter_row['value'] = String(data_row['value'])
    }
}

//check if object value exists.
function BooleanValue(filter_row, data_row) {
    filter_row['data_type']  = "boolean"
    filter_row['query_type'] = "boolean"
    filter_row['value'] = false

    if (data_row.hasOwnProperty('value') ) {
        if (typeof data_row['value'] === "boolean") {
            filter_row['value'] = data_row['value']
        }
    }
}

function NumberValue(filter_row, data_row, data_type) {
    var queryTypeList = ["equals", "greater", "less", "greater_equal", "less_equal", "between","not_between","in"]

    var number_val = {'value_1': null, 'value_2': null, 'value_list': ""}
    // if (data_type === "integer") { number_val['value_list'] = "" }
    if (!['integer', 'float'].includes(data_type)) {data_type = "float"}
    filter_row['value'] = number_val


    filter_row['data_type']  = data_type
    filter_row['query_type'] = ""
    if (! data_row.hasOwnProperty('value') ) {
        filter_row['value'] = number_val
        return
    }
    var vx = data_row['value']
    if (vx === null || typeof vx !== 'object') { return }

    if (vx.hasOwnProperty('value_1') ) {
        var vy = TypeCastNumber(vx['value_1'], data_type)
        filter_row['value']['value_1'] = vy
    }
    if (vx.hasOwnProperty('value_2') ) {
        var vy = TypeCastNumber(vx['value_2'], data_type)
        filter_row['value']['value_2'] = vy
    }
    if (vx.hasOwnProperty('value_list') && data_type === "integer" ) {
        filter_row['value']['value_list'] = String(vx['value_list'])
    }

    if (data_row.hasOwnProperty('query_type') ) {
        if (queryTypeList.includes(data_row['query_type']) ) {
            if ( data_row['query_type'] = "in"  ) {
                if (data_type==="integer") {filter_row['query_type'] = data_row['query_type']}
            } else { filter_row['query_type'] = data_row['query_type'] }
        }  
    }

}

/*
TypeCast functions converts values to proper format. If cant be converetd values will be ignored.
*/

function TypeCastValues(variable_values, variable_type) {
    /*
    This make sure the variable type is correct. Does type conversion to a single value
    or an array of values
    variable_value: this is the value to be modified. Can be a single value or an array of values.
    variable_type: The required type of the value. Can be //integer, float, date, string

    if value cant be converted return null. or an empty list. Skip addition to array
    if empty list?
    */
    if (variable_type == 'integer') {
        if (Array.isArray(variable_values)) {
            let mixedArray = variable_values.map(el=>parseInt(el))
            let integerArray = mixedArray.filter( (value) => !isNaN(value) )
            return integerArray
        } else {
            return parseInt(variable_values)
        }

    } else if (variable_type == 'float') {
        if (Array.isArray(variable_values)) {
            let mixedArray = variable_values.map(el=>parseFloat(el))
            let floatArray = mixedArray.filter( (value) => !isNaN(value) )
            return floatArray
        } else {
            return parseFloat(variable_values)
        }

    } else if (variable_type == 'string') {
        if (Array.isArray(variable_values)) {
            let stringArray = variable_values.map(el=> String(el))
            return stringArray
        } else {
            return String(variable_values)
        }

    } else if (variable_type == 'date') {
        //only checks for single value. No array conversion
        var date_formats = ['YYYY-MM-DD','YYYY-M-DD','YYYY-MM-D','YYYY-M-D', 'MM/DD/YYYY','M/DD/YYYY','MM/D/YYYY','M/D/YYYY']
        var moment_date = moment(variable_values, date_formats, true)
        if (moment_date.isValid()) {
            return moment_date.format('YYYY-MM-DD')
        } else {
            return null
        }
    }
}

function TypeCastDate(date_val, format_string) {
    var date_formats = ['YYYY-MM-DD','YYYY-M-DD','YYYY-MM-D','YYYY-M-D', 'MM/DD/YYYY','M/DD/YYYY','MM/D/YYYY','M/D/YYYY']
    var moment_date = moment(date_val, date_formats, true)
    if (moment_date.isValid()) {
        return moment_date.format(format_string)
    } else {
        return null
    }
}

function TypeCastNumber(num_val, data_type) {
    if (data_type === "integer") {
        num_val = parseInt(num_val)
        if (isNaN(num_val)) {return null}
        else { return num_val }
    }
    if (data_type === "float") {
        num_val = parseFloat(num_val)
        if (isNaN(num_val)) {return null}
        else { return num_val }
    }
    return null
}


function TypeCastPermissionsBoolean(bool_str) {
    if (bool_str === 'true')  {return true}
    if (bool_str === 'false') {return false}
    if (bool_str === 'null')  {return null}
    return null

}


function QueryNumberParse (where_list, where_statement, data_type) {
    //parses where_statement that has data_type integer || float.
    var value_1 = TypeCastNumber(where_statement['value']['value_1'], data_type)
    var value_2 = TypeCastNumber(where_statement['value']['value_2'], data_type)
    var variable_name = where_statement['variable_name']
    var value_list_tmp = []
    var qx = ""
    var wx  = {'variable_name': variable_name,'data_type': data_type , 'query_type': qx ,'value':
    {'value_1': value_1, 'value_2': value_2, 'value_list': value_list_tmp} }

    if (!['integer','float'].includes(data_type)) {return }
    if (data_type === "integer" && where_statement['query_type'] === "in") {
        var value_list = where_statement['value']['value_list']
        value_list = String(value_list).split(/[\n\s,]+/).filter(e => e.trim().length > 0 && e.trim() !== ',' ).map(function(item) { return item.trim(); })
        value_list = TypeCastValues(value_list, data_type)
        // console.log(value_list)
        wx['query_type'] = where_statement['query_type']
        wx['value']['value_list'] = value_list
        if (value_list.length === 0) { return }
        where_list.push(wx)
        return
    }

    if (value_1 === null && value_2 === null ) { return }

    if ( ["equals", "greater", "less", "greater_equal", "less_equal"].includes(where_statement['query_type']) ) {
        if (value_1 === null || isNaN(value_1) ) { return }
        wx['query_type'] = where_statement['query_type']
        where_list.push(wx)
        return
    }
    
    if ( ["between","not_between"].includes(where_statement['query_type']) ) {
        if (value_1 === null || value_2 === null || isNaN(value_1) || isNaN(value_2) ) { return }
        wx['query_type'] = where_statement['query_type']
        where_list.push(wx)
        return
    }
}

function QueryDateParse (where_list, where_statement) {
    var after_date = TypeCastDate(where_statement['value']['after_date'], 'YYYY-MM-DD')
    var before_date = TypeCastDate(where_statement['value']['before_date'], 'YYYY-MM-DD')
    if (after_date === null && before_date === null ) { return }
    var variable_name = where_statement['variable_name']
    var wx = {'variable_name': variable_name,'data_type': 'date' , 'query_type': "" ,'value': {'before_date': before_date, 'after_date': after_date}  }
    if (! where_statement.hasOwnProperty('query_type')) { return} 
    else if (! date_query_types.includes(where_statement['query_type'] ) ) { return }

    wx['query_type'] = where_statement['query_type']

    if(["before_on","equals","before"].includes(wx['query_type']) ) {
        if (before_date === null) { return }
        where_list.push(wx)
        return
    }
    if( "after_on" === wx['query_type'] || "after" === wx['query_type'] ) {
        if (after_date === null) { return }
        where_list.push(wx)
        return
    }
    if(["between","not_between"].includes(wx['query_type']) ) {
        if (before_date === null || after_date === null ) { return }
        where_list.push(wx)
        return
    }
}
function QueryStringParse (where_list, where_statement) {
    //is comma delimited? strip white space? trim?
    //if in send list
    //else send string
    var value = String(where_statement['value'])
    var value_list = []
    var query_type = where_statement['query_type']
    var variable_name = where_statement['variable_name']
    var wx
    if (!['in','equals','not_in'].includes(query_type)) {return }

    if (where_statement['query_type'] === "in" || where_statement['query_type'] === "not_in" ) {
        if (where_statement['isComma']) {
            value_list = String(value).split(',').filter(e => e.trim().length > 0 && e.trim() !== "," ).map(function(item) { return item.trim(); })
            value_list = TypeCastValues(value_list, "string")
        } else {
            value_list = String(value).split(/[\n\s]+/).filter(e => e.trim().length > 0 )
            value_list = TypeCastValues(value_list, "string")
        }
        if (value_list.length === 0) { return }
        value = value_list
        wx = {'variable_name': variable_name,'data_type': 'string' , 'query_type': query_type ,'value': value }
        where_list.push(wx)
        return
    } else if (where_statement['query_type'] === "equals") {
        wx = {'variable_name': variable_name,'data_type': 'string' , 'query_type': query_type ,'value': value }
        where_list.push(wx)
        return
    }


}

function QueryBooleanParse (where_list, where_statement) {

    var vx = where_statement['value']
    var variable_name = where_statement['variable_name']
    if (typeof vx !== 'boolean') {return}

    wx = {'variable_name': variable_name,'data_type': 'boolean' , 'query_type': 'boolean' ,'value': vx }
    where_list.push(wx)

}

function NextPage(pagination ) {
    var lx =parseInt(pagination['limit'] )
    var offset = parseInt(pagination['offset'] )
    pagination['offset'] = lx + offset
}


</script>

<style scoped lang="scss">
  @import '~flatpickr/dist/flatpickr.css';

</style>
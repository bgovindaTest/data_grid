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
-->
<template>
<div>

    <div v-if="isNullInput" />
    <div v-else-if="isNumber" class="mt-2">
      <div v-if="isInInput"> 
        <textarea class="textarea block" placeholder="e.g. Hello world"></textarea>
      </div>
      <div v-else>
        <input class="input" type="number" placeholder="Number input" v-model="filterRow.value">
        <input v-if="isBetweenInput" class="input mt-1" type="number" placeholder="Number input" v-model="filterRow.value2">
      </div>
    </div>

    <div v-else-if="isTimeUnit" class="mt-2">
      <flat-pickr ref="datePicker" v-model="filterRow.value" class="input box" placeholder="Enter date" ></flat-pickr>
      <flat-pickr v-if="isBetweenInput" ref="datePicker2" v-model="filterRow.value2" class="input box" placeholder="Enter date" ></flat-pickr>
    </div>

    <div v-else-if="isText" class="mt-2">
      <div v-if="isInInput"> 
        <textarea class="textarea block" placeholder="e.g. Hello world" v-model="filterRow.value"></textarea>
        <label class="label">Select Delimiter</label>
        <div class="select">
          <select v-model="filterRow.delimiterType">
              <option v-for="(dx, index) in delimiterList" :key="index" :value="dx.delimiterType" >{{dx.delimiterName}}</option>
          </select>
        </div>

      </div>
      <div v-else>
        <input class="input" type="text" placeholder="text" v-model="filterRow.value">
      </div>
    </div>

    <div v-else-if="isBoolean" class="mt-2">
        <div class="select" >
          <select class="is-inline-block ml-2" v-model="filterRow.value">
              <option value="true" >True</option>
              <option value="false">False</option>
          </select>
        </div>
    </div>
</div>
</template>
<script>


// //determine if string should be split into an array
// let array_parse_types  = ['like_in', 'not_like_in', 'ilike_in', 'not_ilike_in', 'in', 'not_in' ]
// //determine if values should be stored as array length 2. for between not_between
// let between_parse_types  = ['between', 'not_between']
// let null_parse_types = ['is_null', 'is_not_null']

import data_config from '@/lib/DataConfig'
import type_check  from '@/lib/TypeCheck'
import flatPickr   from 'vue-flatpickr-component';

export default {
  props: {
    filterRow: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      delimiterList: []
    }
  },
  mounted() {
    let delimiterTypes = Object.keys( data_config.delimiter_typeName )
    let typeName = data_config.delimiter_typeName
    for (let i =0; i < delimiterTypes.length; i++ ) {
      let x = {}
      x['delimiterType'] = delimiterTypes[i]
      x['delimiterName'] = typeName[ delimiterTypes[i] ]
      this.delimiterList.push( x )
    }
    console.log(this.delimiterList)
  },

  components: { flatPickr },
  computed: {
      isNumber() { return data_config.number_types.includes(this.filterRow['dataType'] )},
      isText() { return ['character', 'varying', 'varchar', 'char', 'text'].includes(this.filterRow['dataType']) },
      isDate() { return this.filterRow['dataType'] === 'date' },
      isDateTime() {return ['datetime', 'timestamp', 'timestampz'].includes( this.filterRow['dataType'] ) },
      isTime() {return this.filterRow['dataType'] === 'time'},
      // isInterval() {return this.data_type === 'interval'},
      isBoolean() {return this.filterRow['dataType'] === 'bool' || this.filterRow['dataType'] === 'boolean'},
      isTimeUnit() { return this.isDate||this.isDateTime || this.isTime },

      //determines input fields based on operator
      isBetweenInput() {
        if ( data_config.between_parse_types.includes(  this.filterRow['operator'] ) ) { return true }
        return false
      },
      isInInput() {
        //for textbox
        if ( data_config.array_parse_types.includes(    this.filterRow['operator'] )) { return true }
        return false
      },
      isNullInput() {
        if ( data_config.null_parse_types.includes(     this.filterRow['operator'] )) { return true }
        return false
      },
      flatPickerConfig() {
        if (this.isTime ) {
          return  {
              enableTime: true,
              enableSeconds: true,
              dateFormat: "YYYY-MM-DD  HH:MM:SS",
              allowInput: false,
              noCalendar: true,
              parseDate: (datestr, format) => {
                return type_check.TypeCastDateTime(datestr)
              }
          }
        } else if (this.isDateTime ) {
          return  {
              enableTime: true,
              enableSeconds: true,
              dateFormat: "YYYY-MM-DD  HH:MM:SS",
              allowInput: false,
              parseDate: (datestr, format) => {
                return type_check.TypeCastDateTime(datestr)
              }
          }
        } else { //(this.isDate) default{
          return  {
              dateFormat: "YYYY-MM-DD",
              allowInput: false,
              parseDate: (datestr, format) => {
                return type_check.TypeCastDate(datestr)
              }
          }
        } 

      }
  }
}
</script>
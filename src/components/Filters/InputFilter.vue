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

    <!-- individual -->

    <!-- <div style="height:100%; width: 100%;" ref="dx">
        <flat-pickr style="height:100%; width: 100%;" ref="datePicker" v-model="date" :config="config"></flat-pickr>
    </div> -->

    <!-- operator defined -->
    <div v-if="isTimeUnit">

      <flat-pickr ref="datePicker" v-model="date" class="input box" placeholder="Text input button" ></flat-pickr>
      <flat-pickr v-if="isBetween" ref="datePicker2" v-model="date" class="input box" placeholder="Text input button" ></flat-pickr>

    </div>

    <div v-else-if="isNumber">
      <!-- not in -->
      <input class="input" type="number" placeholder="Number input">
      <input v-if="isBetween" class="input" type="number" placeholder="Number input">
      <!-- in no delimiter-->
      <textarea class="textarea block" placeholder="e.g. Hello world"></textarea>

    </div>


    <div v-else-if="isText">
      <!-- not in -->
      <input class="input" type="text" placeholder="Number text">
      <!-- in select delimiter -->
      <textarea class="textarea block" placeholder="e.g. Hello world"></textarea>

    </div>

    <div v-else-if="isBoolean">
        <div class="select" >
          <select class="is-inline-block ml-2" v-model="order_by[index].column_order">
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
import type_check from  '@/lib/TypeCheck'

export default {
  props: {
    filterRow: {
      type: Object,
      default: {}
    }
  },
  computed: {
      isNumber() {
          return this.data_type in ['integer', 'float', 'real', 
            'number', 'decimal', 'numeric', 'smallint','bigint',
            'double precision', 'serial', 'bigserial', 'smallserial'
            ]
      },
      isText() { return this.data_type in ['character', 'varying', 'varchar', 'char', 'text'] },
      isDate() { return this.data_type === 'date' },
      isDateTime() {return this.data_type === 'timestamp'},
      isTime() {return this.data_type === 'time'},
      isInterval() {return this.data_type === 'interval'},
      isBoolean() {return this.data_type === 'bool' || this.data_type === 'boolean'},
      isTimeUnit() { return this.isDate||this.isDateTime || this.isInterval },

      //determines input fields based on operator
      isBetweenInput() {
        if (this.operator === "between" || this.operator === "not_bewteen") { return true }
        return false
      },
      isInInput() {
        //for textbox
      },
      isNullInput() {},
      isDefaultInput() {},


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
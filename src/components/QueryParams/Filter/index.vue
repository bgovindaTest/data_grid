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
<div>





  <div class='level'>
    <div class="levelLeft">
      <button class="button is-small is-light" @click="AddRow()">Add</button>
      <button class="button is-small ml-2 is-light" @click="DeleteRow()">Delete</button>
      <button class="button is-small ml-2 is-light" @click="ClearRows()">Clear</button>
    </div>

    <div class="levelRight">
      <button class="button is-small is-success" @click="Accept()">Accept</button>
      <button class="button is-small ml-2 is-danger" @click="Cancel()">Cancel</button>
    </div>


  </div>




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
        <a  v-for="(item, index) in columns" :key="index"  href="#" class="dropdown-item">
          <p @mousedown="AddFilter(item)" >{{item.column_name}}</p>
        </a>
      </div>
    </div>
  </div>



</div>
</template>

<script>
// import NumericFilter from '../filters/numeric_filter.vue'
// import DateFilter from '../filters/date_filter.vue'
// import StringFilter from '../filters/string_filter.vue'
// import PermissionsFilter from '../filters/permissions_filter.vue'
// import BoolFilter from '../filters/bool_filter.vue'
// import FilterSelect from '../filters/filter_select.vue'
// import QuickFilter from '../filters/quick_filter.vue'

/*
variable_name
data_type
value

*/



export default {
  // components: {NumericFilter, DateFilter, StringFilter,BoolFilter, PermissionsFilter, FilterSelect, QuickFilter},
  data() {
    return {
      dropdown_active: false,

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
  methods: {
    AddFilter (column_filter) {
      // console.log(column_filter)
      this.filters.push(column_filter)
      console.log(this.filters)
      console.log('hi')
      console.log(column_filter.column_name)
      this.dropdown_active=false
      console.log('bye')


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
</script>

<!--
This module stores the information needed to select the order at which rows will be returned from the server. 

The possible column fields are stored in the columnSortNames array. The user selected values are stored in the
order_by object. This information is parsed by get_route_params on RunQuery.


  {'column_name': "a", "column_order": "" }
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

  <div v-for="(n,index) in order_by" v-bind:key="index" >
        <p class="is-inline-block is-size-4 mr-2 mb-3" >{{SortLabel(index)}} </p>
        <div class="select" >
          <select class="is-inline-bloc" v-model="order_by[index].column_name">
              <option value="" disabled selected hidden>Select a Column</option>
              <option v-for="(valx, index2) in remaining_options(index)" :key="index2" :value="valx">{{valx}}</option>
          </select>
        </div>
        <div class="select" >
          <select class="is-inline-block ml-2" v-model="order_by[index].column_order">
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
          </select>
        </div>
        <button class="delete ml-2 is-vcentered mt-2" type="button" @click="DeleteRowAtIndex(index)"></button>
  </div>



</div>
</template>
<script>


export default {

  data() {
    return {


      order_by: [
        {'column_name': "a", "column_order": "" },
        {'column_name': "b", "column_order": "" },
        {'column_name': "c", "column_order": "" },
        {'column_name': "d", "column_order": "" }
      ],
      columnSortNames: ['a','b','c','d','e','f','g','h','i',
        'j','k', 'l','m','n','o','p','q','r','s','t'] //,
      // 'b': b,
      // 'vx': vx
    }
  },  

  mounted: function () {
    if (this.order_by.length < 1) {
      this.order_by.push({'column_name': "", "column_order": "asc" })
    }
    this.SetDefaultSortOrder()
  },


  methods: {
    remaining_options (index) {
      var tmp = []
      var current_value = this.order_by[index].column_name
      this.columnSortNames.forEach( (cv) => {
        var hit = false
        var i
        for (i=0; i <this.order_by.length; i++) {
          // console.log(ob)
          if (this.order_by[i].column_name === cv) {
            hit = true
            break
          }          
        }
        if (!hit) {tmp.push(cv)}
      })
      if (current_value !== "") { tmp.push(current_value)}

      return tmp
    },

    SetDefaultSortOrder() {
      for(var i =0; i < this.order_by.length; i++) {
        if (this.order_by[i].column_order.trim() === '') {
          this.order_by[i].column_order = 'asc'
        }
      }

    },


    SortLabel(i) {
      if (i==0) { return 'sort by:' }
      else {return 'then by:'}
    },

    AddRow() {
      if (this.order_by.length < this.columnSortNames.length) {
        this.order_by.push({'column_name': "", "column_order": "asc" })
      }
    },
    ClearRows() {
      while(this.order_by.length > 1) {
        this.order_by.pop()
      }
      this.order_by[0]['column_name'] = ""
      this.order_by[0]['column_order'] = "asc"
    },
    DeleteRowAtIndex(index) {
      if (this.order_by.length <= 1 ) {
        this.order_by[0]['column_name'] = ""
        this.order_by[0]['column_order'] = "asc" 
      }
      else if (index < 0 || index > this.order_by.length) {}
      else {
        this.order_by.splice(index, 1)
      }

    },

    DeleteRow() {
      if (this.order_by.length > 1) {
        this.order_by.pop()
      }
      else if (this.order_by.length === 1) {
        let x = this.order_by[0]
        x.column_name = ""
        x.column_order = "asc"
      }
    }
  }
}

function ColumnSortParams(where_sort_rules) {
    /*
    This function takes the where_sort_rules object and creates two objects used to determine what
    columns can be sorted from the server data and an object to store the rules for the sort passed. The variable_name
    is added to columnSortNames if the where_sort_rules as is_sort: true. if it has a sort_order: asc/desc as a default value
    its added to the order_by object as a default 

    returns:
        columnSortNames: List of all columns that a user can sort by
        order_by: [{'variable_name': , 'sort_order':}] a json list that contains what columns should be sorted
            in what order and how.
    */
    var i
    var columnSortNames = []
    var sort_rules = []
    for (i=0; i< where_sort_rules.length; i++) {
        var variable_name = where_sort_rules[i].variable_name
        if (! where_sort_rules[i].hasOwnProperty('is_sort') ) {continue}
        var is_sort = where_sort_rules[i].is_sort
        if (!is_sort) {continue}
        if (!columnSortNames.includes(variable_name) ) { 
            columnSortNames.push(variable_name) 
            if (where_sort_rules[i].hasOwnProperty('sort_order') ) {
                var sort_order = where_sort_rules[i].sort_order
                if ( ['asc', 'desc'].includes(sort_order.toLowerCase()) ) {
                    sort_rules.push({'variable_name': variable_name, 'sort_order': sort_order})
                } else { sort_rules.push({'variable_name': variable_name, 'sort_order': 'desc'}) }
            }
        }
    }
    var output = {}
    output['columnSortNames'] = columnSortNames
    output['order_by'] = sort_rules
    return output
}


</script>
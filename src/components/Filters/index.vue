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

    <div class="mt-2"  v-for="(n,index) in filters" v-bind:key="index" >
        <div class="select" >
            <select class="is-inline-bloc" v-model="filters[index].column_name" @change="SetDefaultFilter(filters[index])" >
                <option value="" disabled selected hidden>Select a Filter</option>
                <option v-for="(fx, index2) in filterList" :key="index2" :value="fx.column_name">{{ReturnHeaderName(fx.column_name)}}</option>
            </select>
        </div>

        <div class="select"  v-if="ShowOperator(filters[index])">
            <select class="is-inline-block ml-2" v-model="filters[index].operator">
                <option  v-for="(ox, oindex) in OperatorList(filters[index].dataType )" :key="oindex" :value="ox">{{ReturnOperatorAlias(ox)}}</option>
            </select>
        </div>
        <button class="delete ml-2 is-vcentered mt-2" type="button" @click="DeleteRowAtIndex(index)"></button>



    </div> 


</div>
</template>

<script>

import data_config from '@/lib/DataConfig'
import InputFilter from "./InputFilter.vue"


export default {
props: {
    filterParams: {
        type: Object,
        default: {
        'new': [],
        'filterList': []
        }
    }
},

data() {
    return {
        filters: null,  
        filterList: [],
        headerNameMap: {},
        dataTypeMap: {}
    }
},
mounted() {
    this.filters = this.filterParams['new']
    let filterList = this.filterParams['filterList']
    for (let i=0; i< filterList.length; i++) {
        let fx = filterList[i]
        let column_name = fx['column_name']
        let header_name = fx['headerName']
        let dataType    = fx['dataType']
        this.headerNameMap[column_name] = header_name
        this.dataTypeMap[column_name]   = dataType
    }
    this.filterList = filterList
},

methods: {

    SetDefaultFilter(  filter_row ) {
        /*
        //column_name comes from field
        //{'column_name': 'col_name_3', 'operator': '!=', 'value':  'a', 'value2': null, delimiterType: null, dataType: null }
        //only require { 'operator': '!=', 'value':  'a', 'value2': null }
        */
        let fx = filter_row
        let column_name = fx['column_name']
        let dataType    = this.dataTypeMap[column_name]
        let operator    = '='
        fx['value'] = null
        fx['valu2'] = null
        fx['delimiterType'] = null
        fx['operator']   = operator
        fx['dataType']   = dataType
        fx['headerName'] = this.headerNameMap[column_name]
    },
    ShowOperator(filter_row) {
        return filter_row.column_name != ""
    },

    ReturnOperatorAlias(operator_name) {
        return data_config.ReturnOperatorAlias(operator_name)
    },
    ReturnHeaderName(column_name) {
        return this.headerNameMap[column_name]
    },

    OperatorList(dataType) {
        let data_class = data_config.ReturnDataClass(dataType)
        if (data_class === 'text') { return data_config.text_operators }
        else if (data_class === 'number')  { return data_config.number_operators  }
        else if (data_class === 'date')    { return data_config.date_operators    }
        else if (data_class === 'boolean') { return data_config.boolean_operators }
        else {return [] }
    },
    AddRow() {
        this.filters.push({'column_name': "", "headerName": "", "value": null, "value2": null, "operator": "=", "delimiterType": null })
    },
    ClearRows() {
        while(this.filters.length > 0) { this.filters.pop() }
    },
    DeleteRowAtIndex(index) {
        if (index < 0 || index > this.filters.length) {}
        else { this.filters.splice(index, 1)}
    },
    DeleteRow() {
        if (this.filters.length >= 0) { this.filters.pop() }
    }
}

}

</script>
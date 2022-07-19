/*
This module controls the functions for filters.vue. 
This module creates the information needed to select which rows will be returned from the server. 

let filterParams  = {'current': defaultFilter, 'new': lodashCloneDeep(defaultFilter), 'filterList': filterList, 'enforcedFilters': enforcedFilter}

filterParams = {
    'current': [
        { value: 'Y', delimiterType: null, column_name: 'b', operator: '=',
          value2: null, dataType: 'text', headerName: 'B'
        }
    ],
    'filterList': [ { headerName: 'B', column_name: 'b', dataType: 'text' } ],
    'new': [
        { value: 'Y', delimiterType: null, column_name: 'b', operator: '=',
          value2: null, dataType: 'text', headerName: 'B'
        }
    ]
}

<filterMixin :filterList="filterParams.filterList" :newFilterList="filterParams.new" />

*/
const data_config         = require('../../lib/DataConfig')
const array_parse_types   = data_config.array_parse_types
const between_parse_type  = data_config.between_parse_type
const null_parse_types    = data_config.null_parse_types
const delimiter_typeName  = data_config.delimiter_typeName
const ReturnDataClass     = data_config.ReturnDataClass
const DefaultOperator     = data_config.DefaultOperator
const ReturnOperatorAlias = data_config.ReturnOperatorAlias
const ReturnDelimiterType = data_config.ReturnDelimiterType




var filterMixin = {
    data() { 
        return { 
            'boolean_options': ['true', 'false']
        }
        //filterTypes
    },

    props: {
        filterList: {
            //jsonArray
            //full list of options to orderBy
            type: Object,
            //required: true
        },
        newFilterList: {
            //jsonArray
            //list of orderBy paramters for next query run.
            type: Object,
            //required: true
        }
    },
    beforeMount() {
        let nf = this.newFilterList
        for(let i =0; i< nf.length; i++ ) {
            if (nf['delimiterType'] === null) {
                nf['delimiterType'] = ReturnDelimiterType( filter_row['dataType'] || null )
            }
        }
    },


    computed: {
        DelimiterList() {
            /*
                Loops through all options available for sorting that are not
                currently in use and returns the remainder alphabetically.
            */
            let keys = Object.keys(delimiter_typeName)
            let x = []
            for (let i=0; i< keys.length; i++) {
                let y = {}
                y['delimiterType'] = keys[i]
                y['delimiterName'] = delimiter_typeName[keys[i]]
                x.push(y)
            }
            return x
        },
        NumberOperators()  { return CreateList (data_config.number_operators) },
        TextOperators()    { return CreateList (data_config.text_operators)   },
        DateOperators()    { return CreateList (data_config.date_operators)   },
        BooleanOperators() { return CreateList (data_config.boolean_operators)},
        DisplayList () {
            /*
                Loops through all options available for sorting that are not
                currently in use and returns the remainder alphabetically.

            */
            let displayList = []
            for (let i =0; i < this.filterList.length; i++ ) {
                let headerI     = this.filterList[i]['headerName']
                let column_name = this.filterList[i]['column_name']
                let dataType    = this.filterList[i]['dataType']
                let x = {'headerName': headerI, 'column_name': column_name, 'dataType': dataType}
                displayList.push(x)
            }
            let sortedDisplayList = displayList.sort( (function(a, b){
                    let nameA = a.headerName.toLowerCase() 
                    let nameB = b.headerName.toLowerCase();
                    if (nameA < nameB) { return -1 }//sort string ascending
                    if (nameA > nameB) { return 1}
                    return 0; //default return value (no sorting)
                })
            )
            for (let i=0; i <sortedDisplayList.length; i++) {sortedDisplayList[i]['index'] = i} 
            return sortedDisplayList
        }


    },
    methods: {
        OperatorsList(data_type) {
            let data_class = ReturnDataClass(data_type)
            // /['text', 'number', 'date', 'array', 'object','boolean']
            if (data_class==='number')       { return this.NumberOperators }
            else if (data_class==='date')    { return this.DateOperators }
            else if (data_class==='boolean') { return this.BooleanOperators }
            //add options for other types later
            else { return this.TextOperators }
        },
        InputFieldParams(data_type, operator) {
            /*
            Which input type to display single box. text area boolean drop down
            etc. Controls widgets in filter bar.

            */
            let htmlInput  = 'input'
            let data_class = ReturnDataClass(data_type)
            let show_delimiter = false
            if (data_config.boolean_types.includes(data_type)) {htmlInput = 'selector'}
            if (array_parse_types.includes(operator)) {
                htmlInput  = 'area'
                show_delimiter = true
            }
            else if (null_parse_types.includes(operator))   {htmlInput  = 'null'}  
            else if (between_parse_type.includes(operator)) {htmlInput  = 'two_input'}
            else { htmlInput  = 'input' }
            let params = {'htmlInput': htmlInput, 'dataClass': data_class,
                'show_delimiter': show_delimiter, 'dataType': data_type}
            return params
        },
        AddRow(index) {
            let filter_row = this.filterList[index]
            let delimiterType = ReturnDelimiterType( filter_row['dataType'] || null )
            let ox = DefaultOperator(filter_row['dataType'] || 'text')

            this.newFilterList.push(
                {'headerName': filter_row['headerName'], 'column_name': filter_row['column_name'], 
                    'delimiterType': delimiterType, 'operator': ox, 'value': null,
                    'value2': null 
                }
            )
        },
        OperatorName(operator) {
            //returns name for operator i.e. equals instead of ==
            return ReturnOperatorAlias(operator)
        },
        ClearRows() {
            //remove all filters
            this.newFilterList.length = 0
        },
        ClearValue(index) {
            //resets values
            let fx = this.newFilterList[index]
            fx['value']  = null
            fx['value2'] = null
        },
        DeleteRow(index) {
            //removes object from array at the given position
            if (this.newFilterList.length <= 0 ) { return  }
            else if (index < 0 || index > this.newFilterList.length) {}
            else { this.newFilterList.splice(index, 1) }
        },
    }
}

function CreateList(operator_list) {
    let x = []
    for(let i =0; i < operator_list.length; i++ ) {
        let y = {}
        let dt = operator_list[i]
        y['operator']      = dt
        y['operatorName']  = ReturnOperatorAlias(dt)
        x.push(y)
    }
    return x
}

module.exports = filterMixin
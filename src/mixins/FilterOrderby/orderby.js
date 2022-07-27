/*
This module stores the information needed to select the order at which rows will be returned from the server. 

The possible column fields are stored in the columnSortNames array. The user selected values are stored in the
order_by object. This information is parsed by get_route_params on RunQuery.

orderByParams

let orderByParams = {'current': defaultSort,   'new': lodashCloneDeep(defaultSort), 'orderByList': sortList,  }


    orderByList: [
        { headerName: 'A', 'column_name': 'a' },
        { headerName: 'B', 'column_name': 'b' }
    ]

    'new': [
        { headerName: 'A', column_name: 'a', order_by: 'asc' },
    ],



<orderByMixin :orderByList="orderByParams.orderByList" :newOrderByList="orderByParams.new" />

*/
// //for sorting params
// let orderby_type = ['asc', 'desc'] //do not change
// let sortDisplayName = {'asc': 'Ascending', 'desc': 'Descending'}


var orderByMixin = {
    data() { 
        return { 'order_options': ['asc', 'desc'] }
    },

    props: {
        orderByList: {
            //jsonArray
            //full list of options to orderBy
            type: Object,
            required: true
        },
        newOrderByList: {
            //jsonArray
            //list of orderBy paramters for next query run.
            type: Object,
            required: true
        }
    },
    computed: {
        DisplayList () {
            /*
                Loops through all options available for sorting that are not
                currently in use and returns the remainder alphabetically.

            */
            let displayList = []
            for (let i =0; i < this.orderByList.length; i++ ) {
                let headerI = this.orderByList[i]['headerName']
                let is_active = false
                for (let j=0; j < this.newOrderByList.length; j++ ) {
                    let headerJ = this.newOrderByList[j]['headerName']
                    if (headerJ === headerI) {
                        is_active = true
                        break
                    }
                }
                if (is_active) { continue }
                let column_name = this.orderByList[i]['column_name']
                let x = {'headerName': headerI, 'column_name': column_name}
                displayList.push(x)

            }
            // return displayList
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
        SortLabel(i) {
            //label display next to sortin options
            if (i==0) { return 'sort by:' }
            else {return 'then by:'}
        },
        AddRow(index) {
            let order_row = this.DisplayList[index]
            this.newOrderByList.push(
                {'headerName': order_row['headerName'], 'column_name': order_row['column_name'], 'order_by': 'asc'}
            )
        },
        ClearRows() {
            //remove all order_by parameters
            this.newOrderByList.length = 0
        },
        DeleteRow(index) {
            //removes object from array at the given position
            if (this.newOrderByList.length <= 0 ) { return  }
            else if (index < 0 || index > this.newOrderByList.length) {}
            else { this.newOrderByList.splice(index, 1) }
        },
    }
}

module.exports = orderByMixin
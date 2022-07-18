/*




*/
var myMixin = {
    data () {
        return {
            loading: true,
            pageConfig: null,  //main json object?
            url_params: {},
            global_params: {},
            //main_grid_params
            mainTableData: null,
            mainHeaderParams: null,
            mainGridApi: null,
            mainColumnApi: null,
            mainGridOptions: null,
            mainQueryParams: null,
            /*
                saveModal: false,
                filterModal: false,
                orderByModal: false,

                queryParams: {},
                orderByParams: {},
                filterParams: {},
                enforcedFilterParams: {},
                toSave: {}
            */
            subGridModal: false,


            //subGrid
            subTableData: null,
            subHeaderParams: null,
            subGridApi: null,
            subColumnApi: null,
            subGridOptions: null,
            subQueryParams: null, 
            //active
            tableData: null,
            headerParams: null,
            gridApi: null,
            columnApi: null,
            gridOptions: null,
            queryParams: null,


            /*
                filterOrderByModal
                saveModal
                helpModal
            */


        }
    },
    methods: {
        SetGridObjectParams() {
            /*


                //active parameters
            */
            if (this.subGridModal === true) {
                this.tableData     = this.subTableData
                this.headerParams  = this.subHeaderParams
                this.gridApi       = this.subGridApi
                this.columnApi     = this.subColumnApi
                this.gridOptions   = this.subGridOptions
                this.queryParams   = this.subQueryParams
            } else {
                this.tableData     = this.mainTableData
                this.headerParams  = this.mainHeaderParams
                this.gridApi       = this.mainGridApi
                this.columnApi     = this.mainColumnApi
                this.gridOptions   = this.mainGridOptions
                this.queryParams   = this.mainQueryParams
            }
        },
        onMainGridReady(params) {
            this.gridApi     = params.api
            this.columnApi   = params.columnApi
            this.gridOptions = params
            //add active state updates
        },
        onSubGridReady(params) {
            this.subGridApi     = params.api
            this.subColumnApi   = params.columnApi
            this.subGridOptions = params
        },


    },
    watch: {
        subGridModal(newState, oldState) {



        }
    }
}
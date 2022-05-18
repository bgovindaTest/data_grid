<!--
The Main Page is the main interface to generate each page.

Initializes
modal fields
columnDefintions
defaultColumn

Defined in each file in pages directory
where_sort_rules:
grid_rules: defined in each file in the pages directory. Its used to assemble the 
table_name:
default_route:
custom_routes:

Initialized in components below?
//contains all data. Passes to other components for initialization?
aggrid_params: created in aggrid wrapper. adds row_data, gridOptions, gridApi. Passed to the navbar. Allows the navbar functions
    to acceses the grid data and objects.
user_permissions: stores user permissions object. Determines what modules and features should be used on the client side.

page_status:

autocomplete_maps:

Created by ./library/query_params ?inputs?:
where:
order_by:
pagination:
columnSortNames:
modalParams:
    saveModal? messages?
        //on close clear information?


props: The props are pased from .vue files in the @/pages directory

table_name: The name of the url table displayed. Shows up in the footer 
    type: String

table_id: id for table to get the user permissions from?

query_rules: This defines what values can be used to filter and sort server data before being sent to the client. The form
    of the Array can be found in ./library/query_params.js
    type: Array,

query_params: This object contains additional optional paramters for ./library/query_params.js in generally contains default
    values for the query_rules filters.
    type: Object,


query_pagination: Default starting row and page size i.e. offest and limit. limit is also used to set the number of rows
    when using the New Sheet function to create empty rows
    type: Object


grid_column_rules: This contains the instructions to generate the columnDefinitions to create the Aggrid Table. The API
    Instructions can be found in @/library/grid_init.js
    type: Array,


user_permissions_route: the url path to use to pull the users permsissions.
    type: String


save_route: url path used to send data to inorder to save to the server. 
    type: String

//new_row_inputs
new_input_params: Contains key:value pairs where the key is the name of the column and value is the default value. Its used
    to prepopulate new rows with the correct parameter and empty value fields. Check @/library/app_functions/field_functions.js
    type: Object,


query_routes: { //change to query routes? initialized in field_functions.InitalizeRowCreation
    //route_name -> {route, description}
    type: Object,
query_routes: { //need to have save route inorder to define how default values will be added. Contains the instruction on how to run the query type modal.
    input_params contains default values for populating data from the server and using it as a entry form set.
    'current_cfte(i)': {'route':'/route/path/insert', 'input_params': {'__save_route__': 'insert'} , 'description': 'New cfte. on save will try to create a new row'},
    'current_cfte(u)': {'route':'/route/path/update', 'input_params': {'__save_route__': 'update'} , 'description': 'current cfte. on save will try to update current row'},
    'default': {'route':'/route/path/update', 'input_params': {'__save_route__': 'update'} , 'description': 'xx'},
 }


/*
local_data for testing
*/
local_rowData: Used for testing purposes. Contains all fields required for rowData
    type: Array

data:
user_permissions: This object stores all the user permissions. 
page_status: Contains the current status of the page. i.e. is loading, saving, etc. Use to set different states for the app
    type: Object

autocomplete_map: this object stores all the information needed for the autocomplete widget. For more information see 
    @/library/init_functions/autocomplete_init.js

get_route_params: This object is used to save the parameters for query pulls from the server. The object is created every
    time the user presses the run query fuction. The parameters are filled from the values set in the query options.

{
    'current_get_route': "", 
    'where': [],
    'rules': [],
    'pagination': {},
    'order_by': []
},

//These objects are used to store the corresponding query information the user enters into the front end. modalParams contains
a separate object for each modal window. Which contains and saves parameters for each modal. It also allows for other vue components
to communicated with the modal window.
modalParams: null,
where: null,
order_by: null,
columnSortNames: null,
pagination: null,

//
gridParams: contains most of the important objects for running the grid. It mainly contains refrences to props and data fields stored
    in the main_page.vue

//aggrid objects are created in main_page.vue but mostly initiated in aggrid_main.vue. Creating the objects in main_page.vue allows
the objects to be passed to other components while still being created by aggrid.
columnApi: Contains the column api for aggrid.
gridOptions: Containts the main aggrid api
external_filter_params: stores the current external filter information 
defaultColDef: default column defintiions for aggrid.
columnDefs: This is generated from the grid_column_rules being passed to grid_init.js. Contains parameters for aggrid.
rowData: Main object where user and server data is stored for client side interaction


-->
<template>
    <div>
        <!-- pass grid objects -->
        <div v-if="page_status.initial_loading">
            <loading-page v-bind:initial_loading_error="this.page_status.initial_loading_error" />
        </div>

        <div v-else>
            <div v-if="has_read_access">
                <main-modal v-bind:modalParams="modalParams" v-bind:order_by="order_by" v-bind:columnSortNames="columnSortNames"
                    v-bind:pagination="pagination" v-bind:where="where" v-bind:query_routes="query_routes"
                />
                <div>
                    <nav-bar v-bind:gridOptions="gridOptions" v-bind:new_input_params="new_input_params" 
                        v-bind:rowData="rowData"  v-bind:server_fields="gridParams.field_variables.server_fields"
                        v-bind:external_filter_params="external_filter_params" 
                        v-bind:user_permissions="user_permissions"

                        v-bind:ForceRowDataReset="ForceRowDataReset"

                        v-bind:autocomplete_map="autocomplete_map"

                        v-bind:field_variables="gridParams.field_variables"
                        v-bind:query_routes="query_routes"
                        v-bind:route_name="modalParams.querytype_modal.route_name"
                        v-bind:pagination="pagination"
                        v-bind:where="where"
                        v-bind:order_by="order_by"
                        v-bind:save_route="save_route"
                        v-bind:get_route_params="get_route_params"

                        v-bind:load_modalParams="modalParams.load_modal"
                        v-bind:save_modalParams="modalParams.save_modal"
                        />
                    <aggrid-main
                        :rowData="rowData" :columnDefs="columnDefs" :defaultColDef="defaultColDef"
                        :columnApi="columnApi" :gridOptions="gridOptions" v-bind:external_filter_params="external_filter_params"
                        v-bind:server_fields="gridParams.field_variables.server_fields"
                        v-bind:new_input_params="new_input_params"
                        v-bind:user_permissions="user_permissions"
                    ></aggrid-main>
                    <page-footer :table_name="table_name"
                        v-bind:query_routes="query_routes"
                        v-bind:user_permissions="user_permissions"
                        v-bind:load_modalParams="modalParams.load_modal"
                    />
                </div>
            </div>
            <div v-else> <access-denied :table_name="table_name" /> </div>
        </div>
    </div>
    
</template>

<script>
import LoadingPage from '@/components/page_layout/loadingpage'
import NavBar from '@/components/page_layout/navbar'
import PageFooter from '@/components/page_layout/page_footer'
import AccessDenied from '@/components/page_layout/accessdenied'

import AggridMain from '@/components/aggrid_main/aggrid_main'
import MainModal from '@/components/modal_windows/main_modal'

import qparams from '@/library/query_params.js'
import grid_init from '@/library/grid_init.js'

import autocomplete_init from '@/library/init_functions/autocomplete_init'
// import column_def_init from '@/library/init_functions/column_def_init'
import field_functions from '@/library/app_functions/field_functions'
import gpf from '@/library/app_functions/grid_param_functions'


import crud_functions from '@/library/app_functions/crud_functions'

export default {
    components: {MainModal, LoadingPage, NavBar, PageFooter, AggridMain, AccessDenied},
    props: {
        table_name: {
            type: String,
            // required: true
        },
        //table_id: id for table to get the user permissions from?

        query_rules: {
            type: Array,
            required: true
        },
        query_params: {
            type: Object,
            required: true
        },
        query_pagination: {
            type: Object,
            required: true            
        },
        grid_column_rules: {
            type: Array,
            // required: true
        },
        //need to add permissions route.
        save_route:{ 
            type: String
        },
        //new_row_inputs
        new_input_params: {
            type: Object,
        },
        query_routes: { //change to query routes?
            //route_name -> {route, description}
            type: Object,
            // required: true
        },
        user_permissions_route: {
            default: 'path to user permissions',
            type: String
        },
        table_id: {
            //table_id for table. Stored in data_tables
            default: -1,
            type: Number
        },
        local_user_permissions: {
            default: function () {return {} },
            type: Object
        },
        /*
        local_data for testing
        */
        local_rowData: {
            default: function () {return [] },
            type: Array
        },
    },
    data() {
        return {
            user_permissions: {},
            page_status: {
                initial_loading: true,
                initial_loading_error: ""
                //crud_error
                //is_saving
                //is_loading_data
            }, //is_loading? is_error? is_server_error?, is_init, is_next_page
            autocomplete_map: {},

            get_route_params: {
                'current_get_route': "",
                'route_name': "",
                'input_params': {},
                'where': [],
                'rules': [],
                'pagination': {},
                'order_by': []
            },
            gridParams: {},
            columnSortNames: [],
            //loading module information
            where: null,
            order_by: null,
            columnSortNames: null,
            pagination: null,
            modalParams: null,

            //aggrid stuff
            columnApi: {},
            gridOptions: {},

            external_filter_params: {
                'value': 'all',
                'options': ['all', 'new_rows','update_rows',
                    'editable_rows','delete_rows', 'incomplete_rows','error_rows',
                    'block_save','changed_rows','query_rows'] //options just used as reminder. Hardcoded values in navbar and aggrid component
            },


            defaultColDef:{
                filter: 'agTextColumnFilter',
                // floatingFilterComponent: true,
                editable: false,
                width: 150,
                suppressMenu: true,
                sortable: true,
                resizable: true,
                lockVisible: true,
                floatingFilter: false
            },
            columnDefs: null,
            rowData: []
            //end aggrid stuff
        }
    },
    async mounted () {
        /*
        This object is ran to initialize all the required data from the server. When all initial loading is complete the 
        main page with the nav bar, grid and footer will be displayed. The order of the initializations matter.

        */
        try {
            await this.UserPermissionsInitialize()
            this.gridParams['user_permissions'] = this.user_permissions
            //need to add user_permissions
            this.columnDefs = await grid_init.InitializeAggrid(this.gridParams, this.grid_column_rules, this.autocomplete_map, this.$axios)
            // console.log(this.columnDefs)
            field_functions.InitalizeRowCreation(this.gridParams,this.new_input_params, this.query_routes )
            this.QueryParamsInitialize()
            this.AddLocalData()
            this.page_status.initial_loading = false
            // console.log(this.autocomplete_map)
        } catch (err) {
            // console.log(err)
            // throw err
            this.page_status.initial_loading_error = String(err)
        }
    },
    computed: {
        has_read_access: function () {
            if (!this.user_permissions.hasOwnProperty('allow_read')) {
                return false
            }
            if (gpf.CanRead(this.user_permissions) ) {
                return true
            } else {
                return false
            }
        }
    },
    methods: {
        AddLocalData() {
            //initialize grid with local data
            // if (!this.hasOwnProperty('local_rowData')) {return}
            if (this.local_rowData.length === 0) {return}
            for (let i=0; i<this.local_rowData.length; i++) {this.rowData.push(this.local_rowData[i])}
            this.AddDefaultValues()
        },

        QueryParamsInitialize() {
            /*
            Requires user_permissions to be initialized.


            */
            var data_rules = this.query_rules
            var pagination = this.query_pagination
            var params = this.query_params
            var query_routes = this.query_routes
            var user_perms = this.user_permissions
            var x = qparams.InitializeQueryParams(data_rules, pagination, query_routes, user_perms, params )

            var xwhere = x['where']
            var xorder_by = x['order_by']
            var xcolumnSortNames = x['columnSortNames']
            var xpagintation = x['pagination']
            var xmodalParams = x['modalParams']

            this.where = xwhere
            this.order_by = xorder_by

            this.columnSortNames = xcolumnSortNames
            this.pagination = xpagintation
            this.modalParams = xmodalParams
        },
        AddDefaultValues() {
            //Add missing and private fields to localData
            for (let i =0; i < this.rowData.length; i++ ) {
                var rowx = this.rowData[i]
                for (var key in this.new_input_params ) {
                    if (! rowx.hasOwnProperty(key)) {rowx[key] = this.new_input_params[key] }
                }
            }
        },
        async UserPermissionsInitialize() {
            /*
                Return user permissions for a page. server_route is the rest_route to extract the permissions.
                server_params are the arguments to send to the server. Maybe use one user route url. and send
                different parameters?

                //boolean arguments determine behavior and functionality of grid.
                allow_read: boolean
                allow_insert: boolean
                allow_update: boolean
                allow_deactivate: boolean
                allow_delete: boolean
                is_admin: boolean
                is_assigned: boolean
                //has active permissions?
                //get user permissions
                //find one specialty?

                //need table_id? check specialty_ids?
            */
            //user permissions route? -1
            //axios pull
            var default_user_permissions = {
                'allow_read': false,
                'allow_insert': false,
                'allow_update': false,
                'allow_deactivate': false,
                'allow_delete': false,
                'is_admin': false,
                'is_assigned': false,
                'permission_level': 0
            }


            if (this.table_id === -1) {
                for (const key in this.local_user_permissions) {
                    this.user_permissions[key] = this.local_user_permissions[key]
                    if (!typeof this.user_permissions[key] === "boolean"){
                        if (key === "permission_level") {
                            if (typeof this.user_permissions[key] === "number") {continue}
                        }
                        throw new Error ('Local User Permissions created with wrong permission type')
                    }
                }
                for (const key in default_user_permissions) {
                    if (! this.user_permissions.hasOwnProperty(key)) {
                        this.user_permissions[key] = default_user_permissions[key]
                    }
                }
            } else {
                var server_perm_object = await this.$axios.post('/data/grids/permissions/user_permissions', {'table_id': this.table_id} )
                var server_perms = server_perm_object.data['output']['user_permissions']
                //
                this.user_permissions['allow_read']       = server_perms['allow_read']
                this.user_permissions['allow_insert']     = server_perms['allow_insert']
                this.user_permissions['allow_update']     = server_perms['allow_update']
                this.user_permissions['allow_deactivate'] = server_perms['allow_deactivate']
                this.user_permissions['allow_delete']     = server_perms['allow_delete']
                this.user_permissions['is_admin']         = server_perms['is_admin']
                this.user_permissions['is_assigned']      = server_perms['is_assigned']
                this.user_permissions['permission_level']      = server_perms['permission_level']
            }


        },
        ForceRowDataReset() {
            this.rowData = []
        },

        async CrudTest() {
            //Add Default Parameters to params?
            try {
                var x = await this.$axios.post('/lcgs/maps').data
                console.log(x)
                // var dx = await crud_functions.Test(this.$axios)
                // await new Promise(resolve => setTimeout(resolve, 2000));
                // console.log("This is mounted")
                // console.log(dx)
                //need try catch for error handling. Display error in loading modal.
            } catch (err) {
                console.log(err)
            }

        }
    }
    
}
</script>
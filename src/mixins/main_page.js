// define a mixin object
const debugConfig = require('./load_placeholder.js')


var myMixin = {
    data () {
        return {
            loading: true,
            //page_object
            pageConfig: null,  //main json object?
            url_params: {},
            global_params: {},


            //main_grid_params
            tableData: [],
            headerParams: null,
            saveModal: false,
            filterModal: false,
            orderByModal: false,
            helpModal: false,
            gridApi: null,

            //filterParams:
            //orderByParams:
        }
    },

    LoadDebugParams: function () {
        let defConfig = debugConfig
        return defConfig
    },


    LoadInitialParams: async function () {
            //gets url parameters and loads grid_configuration file.
            //checks existance and permissions
            console.log('hello from mixin!')
            this.SetMainGrid()
            //extract crud functions?
            this.loading = false
    },
    LoadMainGrid: async function () {},






} 
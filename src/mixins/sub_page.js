//subPage requires sub_page.js and this mixin to function.

var myMixin = {
    data () {
        return {
            tableData: [],
            headerParams: null,
            saveModal: false,
            filterModal: false,
            orderByModal: false,
            helpModal: false,
            gridApi: null,
    
        }
    },

    props: {
        init_load: true, //loads data by default
        //subset of main json object?
        subPageConfig: null,
        mainRowParams: null, //passed from calling row
        //pageParams: //pased from main page
        //main_grid_params
    }



} 

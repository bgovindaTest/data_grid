/*
This mix in is used in the Main.vue

It mainly calls the initialization scripts in GridPraser

Combines modules from GridFunctions and GridParser into main mixin

*/

// define a mixin object
const debugConfig = require('./load_placeholder.js')


var myMixin = {
data () {
    return {
        pageConfig: null,  //main json object?
        url_params: {},
        global_params: {}
    }
},

methods: {
    LoadDebugParams: function () {
        let defConfig = debugConfig
        return defConfig
    },


    LoadInitialParams: async function () {
            //gets url parameters and loads grid_configuration file.
            //checks existance and permissions.
            console.log('hello from mixin!')
        }
    },
    LoadMainGrid: async function () {},
    LoadData: async function () {},
    Insert: async function () {},

}


module.exports = myMixin

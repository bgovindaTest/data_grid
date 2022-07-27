/*
Makes text a link. Creates new tab or redirect current tab. Also can change default 
    color, bolding, and mouseover effect

LinkParams expects row to have field as object with
field: {'urlName': 'xyz', 'urlPath'}


Links are read only. Default null
dataType: text
showFilter: false
showSort:   false
editable: false
chmodParams: 'r'
cellRenderer: "links"

//stored as objects by default?
To add later
    useParams: bool
    is_object: true
    //other effects
    text_color:?
*/

const type_check = require('../../../TypeCheck')

class LinkParams {
    constructor (grid_column) {
        this.grid_column = grid_column
    }
    LinkInit() {
        //add cell render
        this.SetDefaults() 
        this.grid_column['cellRenderer'] = function (params) {

            if (type_check.IsUndefined(params.value) ){ return `<p style="color:red;">No url path</p>` }
            if (!type_check.IsObject(params.value) ){ return `<p style="color:red;">No url path</p>` }

            if (! params.value.urlPath) {
                return `<p style="color:red;">No url path</p>`
            }

            let urlPath = params.value.urlPath
            let urlName = ""

            if (! params.value.hasOwnProperty('urlName') ) { urlName = urlPath } 
            else { urlName = params.value.urlName }

            //make urlPath url safe?
            return `<a href="${urlPath}" target="_blank" rel="noopener">${urlName}</a>`
            // return '<a href="https://www.google.com" target="_blank" rel="noopener">'+ params.value+'</a>'       
        }
    }
    SetDefaults() {
        //remove parameters not needed. passes cellRenderer function direclty
        this.grid_column['isRequired']  = false
        this.grid_column['ignoreError'] = true 
        this.grid_column['dataType'] = 'text'
        this.grid_column['editable'] = false 
        this.grid_column['hide'] = false 
        let chmodParams = {}
        chmodParams['isPull']   = true  
        chmodParams['isPush']   = false
        chmodParams['isChange'] = false
        this.grid_column['chmodParams'] = chmodParams
    }
}

module.exports = LinkParams
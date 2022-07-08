/*
Makes text a link. Creates new tab or redirect current tab. Also can change default 
    color, bolding, and mouseover effect

Just make a json url for now.
dataType: link?

LinkParams expects row to have
field: {'urlName': 'xyz', 'urlPath'}


Links are read only. Default null
dataType: json
showFilter: false
showSort:   false
editable: false
cellRenderer: "links"
cellRendererParams: {
    url: //,
    urlName: '',
    defaultName: '',
    useParams: bool
    is_object: true
    //other effects
    text_color:?
}

//stored as objects by default?

field

field is url by default

unless field.url field.name

is_editable: false


if json.
else


*/

// cellRenderer: 

class LinkParams {
    constructor (grid_column) {
        this.grid_column = grid_column
    }
    RunInit() {
        let gc  = this.grid_column
        let cep = gc['cellEditorParams']
        if (cep['useParams'] || false) {
            this.grid_column['cellRenderer'] = function (params) {
                let urlName = params.value.urlName
                let urlPath = params.value.urlPath
                //make urlPath url safe?
                return `<a href="${urlPath}" target="_blank" rel="noopener">'+ ${urlName}+'</a>`
                // return '<a href="https://www.google.com" target="_blank" rel="noopener">'+ params.value+'</a>'            
            }

        } else {

        }
    }
    SetDefaults() {
        //remove parameters not needed. passes cellRenderer function direclty
    }


}
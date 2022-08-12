/*
Process the crudParams object

added rows default to insert
pulled rows default to update
delete button defaults to delete

may need to change default behavior

        'routeParams': //i.e. new row, update, delete, etc read/etc create default objects for query params?
            {
                useSaveRoute: bool saveRoute is default_route/save combines all crud types into one payload
                default_route: ->
                select:  ->
                insert:  -> //string or {'route': 'string', 'doInstead': 'update', 'crudParams': {}}
                update:  ->
                delete:  ->
                set_fields: [] //for upsert only
                set_filters: [] //for update will just filter things out from data object
                    //always includes id
                //added from grid_params default_fields: {}
                on_constraint:
                on_conflict:
            }

columnDefs =
    [{'field': x, 'ifNull': 'null'}, {'field': y, 'ifNull': 'null'} ]
if null no crud allowed
*/

class RouteParams {
    constructor (crudParams, columnDefs, baseUrl = "") { 
        this.crudParams = crudParams
        this.columnDefs = columnDefs
        this.baseUrl    = baseUrl
    }

    //ContextWindow
    //ErrorHandling
    DefaultFields() {
        /*
            Extract if null parameters
        */
        let columnDefs = this.columnDefs
        let default_fields = {}
        for(let i=0; i< columnDefs.length; i++) {
            let grid_column = columnDefs[i]
            let field = grid_column['field']
            default_fields[field] = grid_column['ifNull'] || 'null'
        }
        return default_fields
    }

    RouteParamsInit()  {
        /*
        Initializes reqBody object for each crudType
        */
        //if string or only route
        //add all fields?
        let default_fields = this.DefaultFields()
        let crudTypes = ['select', 'insert', 'update', 'delete']
        for (let i =0; i< crudTypes.length; i++ ) {
            let crudType = crudTypes[i]
            if (! this.crudParams.hasOwnProperty(crudType) ) {
                this.crudParams[crudType] = { 'crudType': crudType }
            } else {
                if (! this.crudParams[crudType].hasOwnProperty(['crudType']) ) {
                    this.crudParams[crudType]['crudType'] = crudType
                }
            }
            this.DefaultModifyPrams(this.crudParams[crudType])
            this.crudParams[crudType]['default_fields'] = default_fields
        }
    }
    ReqBody(crudType) {
        /*
            Returns main parameters for req body.
        */
        return this.crudParams[crudType]
    }

    //crudRoute
    DefaultModifyPrams(xCrudParams) {
        /*
            Creates default params object for insert/update/delete
        */
        let defaultParms = this.crudParams
        if (! xCrudParams.hasOwnProperty('route'))            {xCrudParams['route']          = this.DefaultRoute(xCrudParams['crudType'])}
        else {
            xCrudParams['route'] = PathJoin(this.baseUrl, xCrudParams['route'] )
        }
        if (! xCrudParams.hasOwnProperty('on_constraint'))    {xCrudParams['on_constraint']  = defaultParms['on_constraint'] || ""}
        if (! xCrudParams.hasOwnProperty('on_conflict'))      {xCrudParams['on_conflict']    = defaultParms['on_conflict'] || ""}
        if (! xCrudParams.hasOwnProperty('set_fields'))       {xCrudParams['set_fields']     = defaultParms['set_fields'] || [] }
        if (! xCrudParams.hasOwnProperty('set_filters'))      {xCrudParams['set_filters']    = defaultParms['set_filters'] || []}
        if (! xCrudParams.hasOwnProperty('useSaveRoute'))     {xCrudParams['useSaveRoute']   = false }
        else {
            let usr = xCrudParams.hasOwnProperty('useSaveRoute')
            if (typeof usr !== 'boolean') { xCrudParams['useSaveRoute']   = false }
        }
        this.ClearInvalidParameters(xCrudParams)
    }

    ClearInvalidParameters(xCrudParams) {
        /*
            Removes values that dont belong to crud operations
        */
        let crudType = xCrudParams['crudType']
        if (crudType === 'delete' || crudType === 'select') {
            xCrudParams['on_constraint']  = ""
            xCrudParams['on_conflict']    = ""
            xCrudParams['set_fields']     = [] 
            xCrudParams['set_filters']    = []
        } else if (crudType === 'update') {
            xCrudParams['on_constraint']  = ""
            xCrudParams['on_conflict']    = ""
            xCrudParams['set_fields']     = [] 
        } 
    }

    DefaultRoute(crudType) {
        //for generic assembly
        //crudType is insert update or delete
        let base_str = this.crudParams['default_route'] || ""
        base_str = PathJoin(this.baseUrl, base_str)
        if (base_str === "") {
            console.error('default route is not defined in crudParams')
        }
        return PathJoin(base_str, crudType)
    }

}

function PathJoin(base, new_path) {
    let b_end     = base.charAt(base.length -1 )
    let new_1 =    new_path.charAt(0)
    if (b_end === '/') {
        if (new_1 === '/') {return base + new_path.substring(1)
        } else { return base  + new_path }
    } else {
        if (new_1 === '/') {return base + new_path
        } else { return base +'/' + new_path }
    }
}

module.exports = RouteParams
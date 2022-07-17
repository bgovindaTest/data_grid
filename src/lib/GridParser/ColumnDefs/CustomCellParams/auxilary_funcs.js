/*
Initializes push and pull and display keys

pullKey: the name of the pulled key from the api. The name is transformed to the pushKey name when
    sent to the server
pushKey: then name of the field to send to server for modifications
displayKey:

for field provider_id
api has fields id, first_name, last_name, full_name
main query has provider_id.first_name, provider_id.id, provider_id.last_name, provider_id.full_name, provider_id

pullKey: id
pushKey:  provider_id
displayKey: full_name (must be unique)

Lookup query
[{'id':1, 'first_name':'bob', 'last_name': 'johnson', 'full_name': 'bob johnson', 'provider_id': 1}]

grid will display full name when sent to server
'id':1 -> 'provider_id': 1


field and id expected to reference same values. id from the referenced table and
field from the query. The value id is renamed to field when pushed to the server.

*/


function PullPushDisplayKeys( grid_column ) {
    let field = grid_column['field']
    CellEditorParamsCheck(grid_column)
    let cep = grid_column['cellEditorParams']
    if (! cep.hasOwnProperty('pushKey'))    { cep['pushKey'] = field } //name of field to send to database for writes
    if (! cep.hasOwnProperty('pullKey'))    { cep['pullKey'] = 'id' }  //name of id from refernced table
    if (! cep.hasOwnProperty('displayKey')) { cep['displayKey'] = cep['pushKey'] } //pull key is assumed to be the primary key for lookup
}

function CellEditorParamsCheck(grid_column) {
    //if cellEditorParams missing add placeholder and log error
    if (! grid_column.hasOwnProperty('cellEditorParams')) {
        grid_column['cellEditorParams'] = {}
    }
}



module.exports = {'PullPushDisplayKeys': PullPushDisplayKeys, 'CellEditorParamsCheck': CellEditorParamsCheck }
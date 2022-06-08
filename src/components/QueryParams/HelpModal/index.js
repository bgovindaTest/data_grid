function HelpModalWindowParameters(modalParams,params) {

    var helpParams = {'help_msg': ""}

    if (params.hasOwnProperty('help_modal')) {
        if (params['help_modal'].hasOwnProperty('help_msg')) {
            helpParams['help_msg'] = params['help_modal']['help_msg']
        }
    }
    modalParams['help_modal'] = helpParams
}
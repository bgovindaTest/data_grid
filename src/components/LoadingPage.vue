<template>
<div>

    <main-page 
        :query_rules="query_rules"
        :query_pagination="query_pagination"
        :query_params="query_params"
        :table_name="table_name"
        :query_routes="query_routes"
        :new_input_params="new_input_params"
        :save_route="save_route"
        :grid_column_rules="grid_column_rules"
        :table_id="table_id"
    >
    </main-page>
</div>
</template>


<script>
import MainPage from '@/components/main_page'
import validations from '@/library/cell_functions/validations'
import value_getter from '@/library/cell_functions/value_getter'
import value_setter from '@/library/cell_functions/value_setter'
import value_formatter from '@/library/cell_functions/value_formatter'
import cell_style from '@/library/cell_functions/cell_style'
import editable from '@/library/cell_functions/editable'
import moment from 'moment'

const table_id_main = 15
var help_msg = `
<p>One Minus cFTE</p>
<ul>
  <li>appointment_code: appointment identifer. All providers in your specialty permissions assignment that are active</li>
  <li>effective_date: mm/dd/yyyy. The date the cfte is to take affect.</li>
  <li>lawson_fte: Between 0 and 1</li>
  <li>contract: Between 0 and 1</li>
  <li>academic: Between 0 and 1</li>
  <li>administration: Between 0 and 1</li>
  <li>veterans_affairs: Between 0 and 1</li>
  <li>cfte: Between 0 and 1. cfte = lawson_fte - (contract+academic+adminstration+veterans_affairs)</li>
</ul>  
`

export default {
    components: { MainPage},
    // components: { MainPage},
    data() {
        return {
            // local_rowData: [],
            table_name: "One Minus",
            table_id: table_id_main,
            query_rules: [
                {'variable_name': 'last_name','data_describe': "last name of the provider",'is_sort': true, 'is_filter': true, 'filter_active': false, 'filter_show': true, 'data_type': 'string', 'query_type': 'equals', 'value': '' },
                {'variable_name': 'first_name','data_describe': "first_name of the provider",'is_sort': true, 'is_filter': true, 'filter_active': false, 'filter_show': true, 'data_type': 'string', 'query_type': 'equals', 'value': '' },

                {'variable_name': 'lawson_fte','data_describe': "",'is_sort': true, 'is_filter': true, 'filter_active': false, 'filter_show': true, 'data_type': 'float', 'query_type': 'equals', 'value': '' },
                {'variable_name': 'academic','data_describe': "",'is_sort': true, 'is_filter': true, 'filter_active': false, 'filter_show': true, 'data_type': 'float', 'query_type': 'equals', 'value': '' },
                {'variable_name': 'contract','data_describe': "",'is_sort': true, 'is_filter': true, 'filter_active': false, 'filter_show': true, 'data_type': 'float', 'query_type': 'equals', 'value': '' },
                {'variable_name': 'veterans_affairs','data_describe': "",'is_sort': true, 'is_filter': true, 'filter_active': false, 'filter_show': true, 'data_type': 'float', 'query_type': 'equals', 'value': '' },
                {'variable_name': 'academic','data_describe': "",'is_sort': true, 'is_filter': true, 'filter_active': false, 'filter_show': true, 'data_type': 'float', 'query_type': 'equals', 'value': '' },
                {'variable_name': 'contract','data_describe': "",'is_sort': true, 'is_filter': true, 'filter_active': false, 'filter_show': true, 'data_type': 'float', 'query_type': 'equals', 'value': '' },
                // {'variable_name': 'cfte','data_describe': "",'is_sort': true, 'is_filter': true, 'filter_active': false, 'filter_show': true, 'data_type': 'float', 'query_type': 'equals', 'value': '' },
                {'variable_name': 'cfte','data_describe': "",'is_sort': true, 'is_filter': true, 'filter_active': false, 'filter_show': true, 'data_type': 'float', 'query_type': 'equals', 'value': '' },

                {'variable_name': 'cpsc_name','data_describe': "",'is_sort': true, 'is_filter': true, 'filter_active': false, 'filter_show': true, 'data_type': 'string', 'query_type': 'equals', 'value': '' },
                {'variable_name': 'cpsc_code','data_describe': "",'is_sort': true, 'is_filter': true, 'filter_active': false, 'filter_show': false, 'data_type': 'string', 'query_type': 'in', 'value': '' },
                {'variable_name': 'lcg_name','data_describe': "",'is_sort': true, 'is_filter': true, 'filter_active': false, 'filter_show': true, 'data_type': 'string', 'query_type': 'equals', 'value': '' },
                {'variable_name': 'lcg_code','data_describe': "",'is_sort': true, 'is_filter': true, 'filter_active': false, 'filter_show': false, 'data_type': 'string', 'query_type': 'in', 'value': '' },


                {'variable_name': 'entity_name','data_describe': "",'is_sort': true, 'is_filter': true, 'filter_active': false, 'filter_show': true, 'data_type': 'string', 'query_type': 'equals', 'value': '' },
                {'variable_name': 'entity_code','data_describe': "",'is_sort': true, 'is_filter': true, 'filter_active': false, 'filter_show': false, 'data_type': 'string', 'query_type': 'in', 'value': '' },
                {'variable_name': 'department_name','data_describe': "",'is_sort': true, 'is_filter': true, 'filter_active': false, 'filter_show': true, 'data_type': 'string', 'query_type': 'equals', 'value': '' },
                {'variable_name': 'department_code','data_describe': "",'is_sort': true, 'is_filter': true, 'filter_active': false, 'filter_show': false, 'data_type': 'string', 'query_type': 'in', 'value': '' },

                {'variable_name': 'specialty_name','data_describe': "",'is_sort': true, 'is_filter': true, 'filter_active': false, 'filter_show': true, 'data_type': 'string', 'query_type': 'equals', 'value': '' },
                {'variable_name': 'specialty_code','data_describe': "",'is_sort': true, 'is_filter': true, 'filter_active': false, 'filter_show': false, 'data_type': 'string', 'query_type': 'in', 'value': '' },
                {'variable_name': 'cost_center_name','data_describe': "",'is_sort': true, 'is_filter': true, 'filter_active': false, 'filter_show': true, 'data_type': 'string', 'query_type': 'equals', 'value': '' },
                {'variable_name': 'cost_center_code','data_describe': "",'is_sort': true, 'is_filter': true, 'filter_active': false, 'filter_show': false, 'data_type': 'string', 'query_type': 'in', 'value': '' },

                {'variable_name': 'npi','data_describe': "provider npi number",'is_sort': true, 'is_filter': true, 'filter_active': false, 'filter_show': true, 'data_type': 'string', 'query_type': 'equals', 'value': '' },
                {'variable_name': 'employee_number','data_describe': "",'is_sort': true, 'is_filter': true, 'filter_active': false, 'filter_show': false, 'data_type': 'string', 'query_type': 'in', 'value': '' },

                {'variable_name': 'is_active','data_describe': "is appointment active",'is_sort': true, 'is_filter': true, 'filter_active': true, 'filter_show': false, 'data_type': 'boolean', 'query_type': 'boolean', 'value': true },
                {'variable_name': 'email','data_describe': "email of the user who last modified the data",'is_sort': true, 'is_filter': true, 'filter_active': false, 'filter_show': true, 'data_type': 'string', 'query_type': 'equals', 'value': '' },

                {'variable_name': 'effective_date','data_describe': "sort based on when row was last modified",'is_sort': true, 'is_filter': true, 'filter_active': false, 'filter_show': false, 'data_type': 'date', 'query_type': '', 'value': '' },
                {'variable_name': 'updated_at','data_describe': "sort based on when row was last modified",'is_sort': true, 'is_filter': false, 'filter_active': false, 'filter_show': false, 'data_type': 'date', 'query_type': '', 'value': '' },
                {'variable_name': 'id','data_describe': "postgres table id",'is_sort': true, 'is_filter': true, 'filter_active': false, 'filter_show': false, 'data_type': 'integer', 'query_type': 'in', 'value': null },
// ['id','lcg_name','is_active','lcg_code' ,'last_modified_by_user_id', 'updated_at'] 'boolean'
            ],
            query_pagination : {'offset': 0, 'limit': 500},
            query_params: {
                'permissions': {'is_assigned_filter': true},
                'quick_filter': {'data_describe': "Does a quick search against all table fields."},
                'default_query_route': 'current_cfte(i)', 'help_modal': {'help_msg': help_msg }
                //default query_params based on permissions.
            },
            query_routes: { //need to have save route inorder to define how default values will be added
                    'default': {'route':'/data/grids/cfte/one_minus_cftes/get', 'input_params': {'__save_route__': 'update'} , 'description': 'Pulls data directley from one_minus_table'},
                    'current_cfte(i)': {'route':'/data/grids/cfte/one_minus_cftes/current_cfte', 'input_params': {'__save_route__': 'upsert'} , 'description': 'Pulls current cfte. Changes create new rows on save.'},
                    'current_cfte(u)': {'route':'/data/grids/cfte/one_minus_cftes/current_cfte', 'input_params': {'__save_route__': 'update'} , 'description': 'Pulls current cfte. Changes update the current row on save.'},
                    'new_appointments': {'route':'/data/grids/cfte/one_minus_cftes/new_appointments', 'input_params': {'__save_route__': 'upsert'} , 'description': 'Pulls appointments without cfte'},
                    'latest_cfte(i)': {'route':'/data/grids/cfte/one_minus_cftes/latest_cfte', 'input_params': {'__save_route__': 'upsert'} , 'description': 'Pulls latest cfte. Changes create new rows on save.'},
                    'latest_cfte(u)': {'route':'/data/grids/cfte/one_minus_cftes/latest_cfte', 'input_params': {'__save_route__': 'update'} , 'description': 'Pulls latest cfte. Changes update the current row on save.'},
                    // 'save': //
            },
            //user_permissions: {'user_permissions': ,'route':}
            new_input_params: {'__save_route__': 'upsert'},
            save_route: '/data/grids/cfte/one_minus_cftes/save',
            grid_column_rules: [
                /*
                first_name
                last_name
                employee_number
                appointment_code
                effective_date
                lawson_fte
                academic
                contract
                veterans_affairs
                cfte
                npi
                classification
                lcg
                lcg_code
                cpsc
                cpsc_code
                entity
                department
                specialty
                cost_center
                id
                last_modified_by_user_email
                updated_at
                */
                {
                    field: 'last_name',
                    width: 150,
                    data_type: "map",
                    lockVisible: true,
                    cellStyle: {'function': cell_style.NonEditableStyleInputParams, 'input_params': {'display_field': 'last_name', 'autocomplete_field': 'appointment_code'} },
                    valueGetter: {'function': value_getter.ValueGetterMapInputParams, 'input_params': {'display_field': 'last_name', 'autocomplete_field': 'appointment_code'} }
                },


                {
                    field: 'first_name',
                    width: 150,
                    data_type: "map",
                    lockVisible: true,
                    cellStyle: {'function': cell_style.NonEditableStyleInputParams, 'input_params': {'display_field': 'first_name', 'autocomplete_field': 'appointment_code'} },
                    valueGetter: {'function': value_getter.ValueGetterMapInputParams, 'input_params': {'display_field': 'first_name', 'autocomplete_field': 'appointment_code'} }
                },
                // //helper display fields
                {
                    field: 'employee_number',
                    width: 125,
                    data_type: "map",
                    lockVisible: true,
                    cellStyle: {'function': cell_style.NonEditableStyleInputParams, 'input_params': {'display_field': 'employee_number', 'autocomplete_field': 'appointment_code'} },
                    valueGetter: {'function': value_getter.ValueGetterMapInputParams, 'input_params': {'display_field': 'employee_number', 'autocomplete_field': 'appointment_code'} }
                },


                {
                    //return value not implemented :(
                    // headerName: 'classification_name',
                    field: 'appointment_code',
                    width: 220,
                    is_server_field: true,
                    editable: {'function': editable.CanModifyInputParams, 'input_params': {} },
                    lockVisible: true,
                    data_type: "autocomplete",
                    cellEditorFramework: 'AutocompleteAg',
                    cellStyle: {'function': cell_style.EditableStyleInputParams, 'input_params': {} },
                    valueSetter: {'function': value_setter.ValueAutocompleteSetterInputParams, 'input_params': {} },
                    validation: {'function': validations.AutocompleteIsValidInputParams, 'input_params': {} },           
                    cellEditorParams: {
                        return_value: 'appointment_code',
                        return_null: true,
                        crud_value: 'id',
                        column_info: [
                            {header: "last_name", init_width: 100},
                            {header: "first_name", init_width: 100},
                            {header: "npi", init_width: 100},
                            {header: "employee_number", init_width: 130},
                            {header: "cost_center_code", init_width: 130},
                            {header: "cost_center_name", init_width: 200},
                            {header: "entity_department_specialty_code", init_width: 200},
                            {header: "classification_name", init_width: 130},
                            {header: "id" , init_width: 75}
                        ],
                        map_params: {'table_id': table_id_main},
                        map_route: '/data/grids/providers/appointments/maps',
                        return_field: 'appointment_id'
                    },
                },
                //cfte fiels
                {
                    field: 'effective_date',
                    is_server_field: true,
                    width: 150,
                    data_type: "date",
                    editable: {'function': editable.CanModifyInputParams, 'input_params': {} },
                    lockVisible: true,
                    cellStyle: {'function': cell_style.EditableStyleInputParams, 'input_params': {} },
                    valueSetter: {'function': value_setter.ValueDateSetterInputParams, 'input_params': {} }
                },
                {
                    field: 'lawson_fte',
                    is_server_field: true,
                    width: 90,
                    data_type: "float",
                    editable: {'function': editable.CanModifyInputParams, 'input_params': {} },
                    lockVisible: true,
                    cellStyle: {'function': cell_style.EditableStyleInputParams, 'input_params': {} },
                    valueSetter: {'function': value_setter.ValueFloatSetterInputParams, 'input_params': {} },
                    validation: {'function': validations.IsBetweenInputParams, 'input_params': {'greater_equal_to': 0, 'less_equal_to': 1} },
                    valueGetter: {'function': value_getter.NumberDisplay, 'input_params': {} }
                
                },
                {
                    field: 'contract',
                    is_server_field: true,
                    width: 90,
                    data_type: "float",
                    editable: {'function': editable.CanModifyInputParams, 'input_params': {} },
                    lockVisible: true,
                    cellStyle: {'function': cell_style.EditableStyleInputParams, 'input_params': {} },
                    valueSetter: {'function': value_setter.ValueFloatSetterInputParams, 'input_params': {} },
                    validation: {'function': validations.IsBetweenInputParams, 'input_params': {'greater_equal_to': 0, 'less_equal_to': 1} },
                    valueGetter: {'function': value_getter.NumberDisplay, 'input_params': {} }
                },

                {
                    field: 'academic',
                    is_server_field: true,
                    width: 90,
                    data_type: "float",
                    editable: {'function': editable.CanModifyInputParams, 'input_params': {} },
                    lockVisible: true,
                    cellStyle: {'function': cell_style.EditableStyleInputParams, 'input_params': {} },
                    valueSetter: {'function': value_setter.ValueFloatSetterInputParams, 'input_params': {} },
                    validation: {'function': validations.IsBetweenInputParams, 'input_params': {'greater_equal_to': 0, 'less_equal_to': 1} },
                    valueGetter: {'function': value_getter.NumberDisplay, 'input_params': {} }
                },
                {
                    field: 'administration',
                    is_server_field: true,
                    width: 120,
                    data_type: "float",
                    editable: {'function': editable.CanModifyInputParams, 'input_params': {} },
                    lockVisible: true,
                    cellStyle: {'function': cell_style.EditableStyleInputParams, 'input_params': {} },
                    valueSetter: {'function': value_setter.ValueFloatSetterInputParams, 'input_params': {} },
                    validation: {'function': validations.IsBetweenInputParams, 'input_params': {'greater_equal_to': 0, 'less_equal_to': 1} },
                    valueGetter: {'function': value_getter.NumberDisplay, 'input_params': {} }
                },
                {
                    field: 'veterans_affairs',
                    is_server_field: true,
                    width: 130,
                    data_type: "float",
                    editable: {'function': editable.CanModifyInputParams, 'input_params': {} },
                    lockVisible: true,
                    cellStyle: {'function': cell_style.EditableStyleInputParams, 'input_params': {} },
                    valueSetter: {'function': value_setter.ValueFloatSetterInputParams, 'input_params': {} },
                    validation: {'function': validations.IsBetweenInputParams, 'input_params': {'greater_equal_to': 0, 'less_equal_to': 1} },
                    valueGetter: {'function': value_getter.NumberDisplay, 'input_params': {} }
                },




                {
                    field: 'cfte',
                    width: 90,
                    data_type: "float",
                    lockVisible: true,
                    //need to update error and validation fields on rowData. Need declared private fields
                    validation: {'function': validations.LawsonCfteInputParams, 'input_params': {} },
                    cellStyle: cell_style.LawsonCfteStyle,
                    valueGetter: {'function': value_getter.ValueGetterLawsonCfte, 'input_params': {} }
                },




                {
                    field: 'npi',
                    width: 150,
                    data_type: "map",
                    lockVisible: true,
                    cellStyle: {'function': cell_style.NonEditableStyleInputParams, 'input_params': {'display_field': 'npi', 'autocomplete_field': 'appointment_code'} },
                    valueGetter: {'function': value_getter.ValueGetterMapInputParams, 'input_params': {'display_field': 'npi', 'autocomplete_field': 'appointment_code'} }
                },

                {
                    field: 'classification_name',
                    width: 150,
                    data_type: "map",
                    lockVisible: true,
                    cellStyle: {'function': cell_style.NonEditableStyleInputParams, 'input_params': {'display_field': 'classification_name', 'autocomplete_field': 'appointment_code'} },
                    valueGetter: {'function': value_getter.ValueGetterMapInputParams, 'input_params': {'display_field': 'classification_name', 'autocomplete_field': 'appointment_code'} }
                },


                {
                    field: 'cpsc_code',
                    width: 150,
                    data_type: "map",
                    lockVisible: true,
                    cellStyle: {'function': cell_style.NonEditableStyleInputParams, 'input_params': {'display_field': 'cpsc_code', 'autocomplete_field': 'appointment_code'} },
                    valueGetter: {'function': value_getter.ValueGetterMapInputParams, 'input_params': {'display_field': 'cpsc_code', 'autocomplete_field': 'appointment_code'} }
                },



                {
                    field: 'cpsc_name',
                    width: 150,
                    data_type: "map",
                    lockVisible: true,
                    cellStyle: {'function': cell_style.NonEditableStyleInputParams, 'input_params': {'display_field': 'cpsc_name', 'autocomplete_field': 'appointment_code'} },
                    valueGetter: {'function': value_getter.ValueGetterMapInputParams, 'input_params': {'display_field': 'cpsc_name', 'autocomplete_field': 'appointment_code'} }
                },


                {
                    field: 'lcg_code',
                    width: 150,
                    data_type: "map",
                    lockVisible: true,
                    cellStyle: {'function': cell_style.NonEditableStyleInputParams, 'input_params': {'display_field': 'lcg_code', 'autocomplete_field': 'appointment_code'} },
                    valueGetter: {'function': value_getter.ValueGetterMapInputParams, 'input_params': {'display_field': 'lcg_code', 'autocomplete_field': 'appointment_code'} }
                },



                {
                    field: 'lcg_name',
                    width: 150,
                    data_type: "map",
                    lockVisible: true,
                    cellStyle: {'function': cell_style.NonEditableStyleInputParams, 'input_params': {'display_field': 'lcg_name', 'autocomplete_field': 'appointment_code'} },
                    valueGetter: {'function': value_getter.ValueGetterMapInputParams, 'input_params': {'display_field': 'lcg_name', 'autocomplete_field': 'appointment_code'} }
                },


                {
                    field: 'is_active',
                    width: 150,
                    data_type: "map",
                    lockVisible: true,
                    cellStyle: {'function': cell_style.NonEditableStyleInputParams, 'input_params': {'display_field': 'is_active', 'autocomplete_field': 'appointment_code'} },
                    valueGetter: {'function': value_getter.ValueGetterMapInputParams, 'input_params': {'display_field': 'is_active', 'autocomplete_field': 'appointment_code'} }
                },

                {
                    field: 'cost_center_name',
                    width: 150,
                    data_type: "map",
                    lockVisible: true,
                    cellStyle: {'function': cell_style.NonEditableStyleInputParams, 'input_params': {'display_field': 'cost_center_name', 'autocomplete_field': 'appointment_code'} },
                    valueGetter: {'function': value_getter.ValueGetterMapInputParams, 'input_params': {'display_field': 'cost_center_name', 'autocomplete_field': 'appointment_code'} }
                },


                {
                    field: 'entity_name',
                    width: 150,
                    data_type: "map",
                    lockVisible: true,
                    cellStyle: {'function': cell_style.NonEditableStyleInputParams, 'input_params': {'display_field': 'entity_name', 'autocomplete_field': 'appointment_code'} },
                    valueGetter: {'function': value_getter.ValueGetterMapInputParams, 'input_params': {'display_field': 'entity_name', 'autocomplete_field': 'appointment_code'} }
                },

                {
                    field: 'department_name',
                    width: 150,
                    data_type: "map",
                    lockVisible: true,
                    cellStyle: {'function': cell_style.NonEditableStyleInputParams, 'input_params': {'display_field': 'department_name', 'autocomplete_field': 'appointment_code'} },
                    valueGetter: {'function': value_getter.ValueGetterMapInputParams, 'input_params': {'display_field': 'department_name', 'autocomplete_field': 'appointment_code'} }
                },

                {
                    field: 'specialty_name',
                    width: 150,
                    data_type: "map",
                    lockVisible: true,
                    cellStyle: {'function': cell_style.NonEditableStyleInputParams, 'input_params': {'display_field': 'specialty_name', 'autocomplete_field': 'appointment_code'} },
                    valueGetter: {'function': value_getter.ValueGetterMapInputParams, 'input_params': {'display_field': 'specialty_name', 'autocomplete_field': 'appointment_code'} }
                },


                {
                    field: 'id',
                    width: 75,
                    data_type: "integer",
                    editable: false,
                    lockVisible: true,
                    cellStyle: {'function': cell_style.NonEditableStyleInputParams, 'input_params': {} }
                },
                {
                    field: 'last_modified_by_user_email',
                    width: 150,
                    data_type: "string",
                    cellStyle: {'function': cell_style.NonEditableStyleInputParams, 'input_params': {} }
                },
                {
                    headerName: "updated_at",
                    field: "updated_at",
                    data_type: 'datetime',
                    cellStyle: {'function': cell_style.NonEditableStyleInputParams, 'input_params': {} },
                    width: 250,
                    valueFormatter: value_formatter.ValueDateTimeFormatter
                }



            ]
        }
    }
}
</script>
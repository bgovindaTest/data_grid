<template>
<div>
  <div v-if="loading">
    <!-- error msg change color display message i.e. permission denied contact xyz -->
    <page-loader />
  </div>
  <div v-else>
    <grid-header 
        @help="helpModal = true" @add-row="AddRow()"
        @filter-modal="FilterModal()" @orderby-modal="OrderByModal()"
        @pull-data="RunNewQuery()" @previous-page="PreviousPage()" @next-page="NextPage()"
        @new-sheet="NewSheet()" @save="saveModal=true"
        :links="navHeaderParams.links"
        :page_number="page_number"
        :navHeaderParams="navHeaderParams"
        :disable_navbar="disable_navbar"
    />

    <ag-grid-vue
      style="width: 100%; height: calc(100vh - 3.25rem)"
      class="ag-theme-alpine"
      :columnDefs="columnDefs"
      :rowData="tableData"
      @grid-ready="onGridReady"
      suppressPropertyNamesCheck="true"
    />

    <Modal v-model="queryModal" modal-class="fullscreen-modal" title="Query parameters">
      <div class="tabs">
        <ul>
          <li :class="{'is-active':  filter_active  }"><a @click="FilterModal">Filters</a></li>
          <li :class="{'is-active': !filter_active  }"><a @click="OrderByModal">Order By</a></li>
        </ul>
      </div>
      <filters v-if="filter_active" :filterParams="filterParams" @accept="RunNewQuery()" @cancel="CloseQueryModal()"/>
      <order-by v-else :orderByParams="orderByParams" @accept="RunNewQuery()" @cancel="CloseQueryModal()"/>
    </Modal>

    <Modal v-model="helpModal" title="Help Modal" modal-class="modalsm">
      <help :help_msg="help_msg" />
    </Modal>

    <Modal v-model="saveModal" title="Save Modal" modal-class="modalsm">
      <div style ="position: relative; min-height: 450px;">
        <save-data />
      </div>
      <div style="poistion: absolute; bottom: 0, left: 0">
            <button class="button" type="button">Ok</button>
            <button class="button" type="button">Cancel</button>
      </div>
    </Modal>

  </div>
</div>
</template>

<script>
import { AgGridVue } from "ag-grid-vue3";
import VueModal from '@kouts/vue-modal'
import AutoCompleteEditor from "./components/GridEditors/AutoCompleteEditor"
import DateTimeEditor   from "./components/GridEditors/DateTimeSelector"
import crudSelectEditor from "./components/GridEditors/CrudSelectEditor"
// import SubGridSelector from "./components/GridEditors/SubGridSelector"
import GridHeader from "./components/Header"

/*
Modals
*/
import Filters    from "./components/Filters"
import OrderBy    from "./components/OrderBy"
import Help       from "./components/Help"
import PageLoader from "./components/PageLoader"
import SaveData   from "./components/Save"

//main mixin
import grid_controller from "@/mixins/grid_controller"


export default {
  name: "App",
  mixins: [grid_controller],
  components: {
    "ag-grid-vue":AgGridVue,
    "autoCompleteEditor": AutoCompleteEditor,
    "dateTimeEditor":   DateTimeEditor,
    "crudSelectEditor": crudSelectEditor,
    "grid-header": GridHeader,

    "Modal": VueModal,
    "order-by": OrderBy,
    "filters":   Filters,
    "help": Help,
    'page-loader': PageLoader,
    'save-data': SaveData
  },

  methods: {
    Log() {
      console.log('help from main')
    }
  },

  async mounted () {
      /*
      This object is ran to initialize all the required data from the server. When all initial loading is complete the 
      main page with the nav bar, grid and footer will be displayed. The order of the initializations matter.

      MainPage
          1. GetRoute
          2. Pull Configuration
          3. Pull and create ValueObject
          4. Parse Grid Configurations
          5. TurnLoading off
          6. Load Table Data
      SubPage
          1. Parse Sub Grid Configurations
          2. Turn Loading off
          3. LoadData

      */
      this.MainGridInit()
      // await new Promise(r => setTimeout(r, 1000))
      // this.loading = false
  }
};


</script>

<style lang="scss">
  @import "~ag-grid-community/dist/styles/ag-grid.css";
  @import "~ag-grid-community/dist/styles/ag-theme-alpine.css";
  @import "./assets/bulma.scss";
  @import "./assets/vue_modal.scss";
  * { margin: 0 }

  .modal-footer {
    padding: 15px 0px 0px 0px;
    border-top: 1px solid #e5e5e5;
    margin-left: -14px;
    margin-right: -14px;
  }

</style>
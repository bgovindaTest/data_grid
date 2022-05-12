<template>
  <div>
    <NavBar/>
    <button type="button" class="btn btn-primary" @click="showModal=true">
      Open a modal
    </button>

    <Modal v-model="showModal" modal-class="fullscreen-modal" title="My first modal">
        <ag-grid-vue
          style="width: 100%; height: 100%"
          class="ag-theme-alpine"
          :columnDefs="columnDefs"
          :rowData="rowData"
        >
        </ag-grid-vue>
    </Modal>

  </div>
</template>

<script>
import VueModal from '@kouts/vue-modal'
import NavBar from './components/Header.vue'
// import '@kouts/vue-modal/dist/vue-modal.css'
// https://next--vue-modal-demo.netlify.app/installation/#basic
//https://github.com/kouts/vue-modal/tree/next
import { AgGridVue } from "ag-grid-vue3"

export default {
  el: 'App'
  ,
  components: {
    'Modal': VueModal,
    'AgGridVue':AgGridVue,
    'NavBar': NavBar
  },
  data: function() { return {
      showModal: false,
      columnDefs: [
            { field: "make",  editable: true,
            
              cellEditor: 'agSelectCellEditor',
              cellEditorParams: {
                  values: ['Toyota', 'Ford', 'Porsche'],
              }
            },
            { field: "model",  editable: true },
            { field: "price",  editable: true },
      ],
      rowData: [
        { make: "Toyota", model: "Celica", price: 35000  },
        { make: "Ford", model: "Mondeo", price: 32000 },
        { make: "Porsche", model: "Boxster", price: 72000},
        { make: "Toyota", model: "Celica", price: 35000  },
        { make: "Ford", model: "Mondeo", price: 32000 },
        { make: "Porsche", model: "Boxster", price: 72000},
        { make: "Toyota", model: "Celica", price: 35000  },
        { make: "Ford", model: "Mondeo", price: 32000 },
        { make: "Porsche", model: "Boxster", price: 72000},
        { make: "Toyota", model: "Celica", price: 35000  },
        { make: "Ford", model: "Mondeo", price: 32000 },
        { make: "Porsche", model: "Boxster", price: 72000},
        { make: "Toyota", model: "Celica", price: 35000  },
        { make: "Ford", model: "Mondeo", price: 32000 },
        { make: "Porsche", model: "Boxster", price: 72000}, 
        { make: "Toyota", model: "Celica", price: 35000  },
        { make: "Ford", model: "Mondeo", price: 32000 },
        { make: "Porsche", model: "Boxster", price: 72000},
        { make: "Toyota", model: "Celica", price: 35000  },
        { make: "Ford", model: "Mondeo", price: 32000 },
        { make: "Porsche", model: "Boxster", price: 72000},
        { make: "Toyota", model: "Celica", price: 35000  },
        { make: "Ford", model: "Mondeo", price: 32000 },
        { make: "Porsche", model: "Boxster", price: 72000},
        { make: "Toyota", model: "Celica", price: 35000  },
        { make: "Ford", model: "Mondeo", price: 32000 },
        { make: "Porsche", model: "Boxster", price: 72000},
        { make: "Toyota", model: "Celica", price: 35000  },
        { make: "Ford", model: "Mondeo", price: 32000 },
        { make: "Porsche", model: "Boxster", price: 72000},
        { make: "Toyota", model: "Celica", price: 35000  },
        { make: "Ford", model: "Mondeo", price: 32000 },
        { make: "Porsche", model: "Boxster", price: 72000}
    
        
        
        
        
        
        ]      


    }
  }

}


</script>

<style lang="scss">
  @import "~@kouts/vue-modal/dist/vue-modal.css";
  @import "~ag-grid-community/dist/styles/ag-grid.css";
  @import "~ag-grid-community/dist/styles/ag-theme-alpine.css";

.fullscreen-modal {
  width: 100%;
  max-width: 100%;
  top: 0;
  margin: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.fullscreen-modal .vm-titlebar {
  flex-shrink: 0;
}
.fullscreen-modal .vm-content {
  padding: 0;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  min-height: 0; 
}
.fullscreen-modal .vm-content .scrollable-content {
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 10px 15px 10px 15px;
  flex-grow: 1;
}
.fullscreen-modal .fullscreen-modal-footer {
  border-top: 1px solid #e5e5e5;
  padding: 15px;
}


</style>
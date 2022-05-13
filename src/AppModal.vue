<template>
  <div>
    <button type="button"  @click="showModal=true">
      Open a modal
    </button>

    <Modal v-model="showModal" modal-class="fullscreen-modal" title="My first modal">
      <Modalx/>
    </Modal>

  </div>
</template>

<script>
import VueModal from '@kouts/vue-modal'
import Modalx from "./components/ModalTest"


export default {
  el: 'App'
  ,
  components: {
    'Modal': VueModal,
    'Modalx': Modalx
  },
  data: function() { return {
      showModal: false,

    }
  }

}


</script>

<style lang="scss">
  @import "~@kouts/vue-modal/dist/vue-modal.css";

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
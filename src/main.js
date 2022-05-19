import { createApp } from 'vue'
import App from './App.vue'
import 'ag-grid-enterprise';

import { library } from '@fortawesome/fontawesome-svg-core'
// // import { faPhone, faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { faAngleDown, faTrashAlt,  faUndo  } from "@fortawesome/free-solid-svg-icons";
import { faTrashAlt as faTrashRegular  } from "@fortawesome/free-regular-svg-icons";


import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faAngleDown, faTrashAlt, faTrashRegular, faUndo)
// library.add(faPhone)


// Vue.component('font-awesome-icon', FontAwesomeIcon)

// createApp(App).mount('#app')
createApp(App).component("font-awesome-icon", FontAwesomeIcon).mount('#app')
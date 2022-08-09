import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
// import 'ag-grid-enterprise';

import { library } from '@fortawesome/fontawesome-svg-core'
// // import { faPhone, faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { faAngleDown, faTrashAlt,  faUndo, faPlus, faBan  } from "@fortawesome/free-solid-svg-icons";
import { faTrashAlt as faTrashRegular  } from "@fortawesome/free-regular-svg-icons";


import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faAngleDown, faTrashAlt, faTrashRegular, faUndo, faPlus, faBan)
// library.add(faPhone)


// Vue.component('font-awesome-icon', FontAwesomeIcon)

// createApp(App).mount('#app')
const app = createApp(App).component("font-awesome-icon", FontAwesomeIcon) //.mount('#app')
app.use(VueAxios, axios.create(  ))
app.mount('#app')
import { createApp } from 'vue'
import App from './App.vue'
import 'ag-grid-enterprise';

import { library } from '@fortawesome/fontawesome-svg-core'
// // import { faPhone, faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";


import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faAngleDown)
// library.add(faPhone)


// Vue.component('font-awesome-icon', FontAwesomeIcon)

// createApp(App).mount('#app')
createApp(App).component("font-awesome-icon", FontAwesomeIcon).mount('#app')
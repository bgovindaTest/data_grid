//client config place holder
//global config does not work in client app
module.exports = {
    //     //axiosUrl: `http://localhost:8081`,
        // axiosUrl: `https://provider-effort.eastus.cloudapp.azure.com`,
        // loginRoute: 'https://provider-effort.eastus.cloudapp.azure.com/login',
        // logoutRoute: `https://provider-effort.eastus.cloudapp.azure.com/logout`,
        // tutorialRoute: `https://provider-effort.eastus.cloudapp.azure.com/data/tutorial`,
        //tutorialRoute: `http://localhost:8081/data/tutorial`,
    // }
    
    // Configuration for dev server
    axiosUrl: `http://localhost:3000`,
    loginRoute: 'http://localhost:3000/login',
    logoutRoute: `http://localhost:3000/logout`,
    tutorialRoute: `http://localhost:3000/data/tutorial`
    //force_logout
}

// /*
// Axios configuration file. Used to set the http/https base path for all http requests
// for HttpRequests.js
// */

// import axios from 'axios'
// import config from '@/config/config.js'
// axios.defaults.withCredentials = true

// export default () => {
//   return axios.create({
//     //baseURL: `http://localhost:8081`,//,
//     baseURL: config.axiosUrl
//     //withCredentials: true
//   })
// }
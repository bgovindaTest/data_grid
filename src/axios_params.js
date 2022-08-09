/*
Axios configuration file. Used to set the http/https base path for all http requests
for HttpRequests.js

vue-cli-service build --mode development
*/

let envx = process.env.NODE_ENV
let axiosParams = null

if ( ['test','production'].includes(envx)  ) {
    axiosParams = {
        axiosUrl: `https://provider-effort.eastus.cloudapp.azure.com`,
        loginRoute: 'https://provider-effort.eastus.cloudapp.azure.com/login',
        logoutRoute: `https://provider-effort.eastus.cloudapp.azure.com/logout`,
        tutorialRoute: `https://provider-effort.eastus.cloudapp.azure.com/data/tutorial`,
        tutorialRoute: `http://localhost:8081/data/tutorial`,
        baseUrl: `https://provider-effort.eastus.cloudapp.azure.com`,
        axiosConfig: { withCredentials: true }
    }
}

else {
    axiosParams = {
        loginRoute: 'http://localhost:3000/login',
        logoutRoute: `http://localhost:3000/logout`,
        tutorialRoute: `http://localhost:3000/data/tutorial`,
        baseUrl: `http://localhost:3000`
    }
}

module.exports = axiosParams
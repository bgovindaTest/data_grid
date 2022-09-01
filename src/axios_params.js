/*
Axios configuration file. Used to set the http/https base path for all http requests
for HttpRequests.js

vue-cli-service build --mode development
*/

let envx = process.env.NODE_ENV
let axiosParams = null

if ( ['test','production'].includes(envx)  ) {
    axiosParams = {
        axiosUrl: `https://iuhpcbia.azurewebsites.net`,
        loginRoute: 'https://iuhpcbia.azurewebsites.net/login',
        logoutRoute: `https://iuhpcbia.azurewebsites.net/logout`,
        tutorialRoute: `https://iuhpcbia.azurewebsites.net/data/tutorial`,
        baseUrl: `https://iuhpcbia.azurewebsites.net`,
        axiosConfig: { withCredentials: true }
    }
}

else {
    axiosParams = {
        loginRoute: 'http://localhost:3000/login',
        logoutRoute: `http://localhost:3000/logout`,
        tutorialRoute: `http://localhost:3000/data/tutorial`,
        baseUrl: `http://localhost:3000`,
        axiosConfig: {}
    }
}

module.exports = axiosParams
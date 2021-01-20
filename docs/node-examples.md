# Node Examples using JSON web tokens with Qlik Sense Enterprise

The express example creates the token, gets the session cookie from the response, and sets the cookie in the browser.  before serving pages of React application and demonstrates loading Qlik resources from a web page hosted on a remote web server from the Qlik Sense environment with Jwt auhorization

## general information

* Please make sure to import the Consumer Sales and Helpdesk app  (if you have not already) before running the mashup example.  The app is located in the qlik-apps folder at the root of the repository.  Obtain the guid for the app.

* Please follow the **[instructions}(vpconfig.md)** on setting up a json web token virtual proxy in Qlik Sense before continuing with the node examples.

* Each example requires some configuration in the corresponding js file and support files.  Please follow the configuration instructions below.

### general configuration (in src/server.js)

> _jwtEncryptionKey_: Enter the path to the private key used to encrypt the json web token.

> _hostname_: Hostname of Qlik Sense server where jwt token will be sent.

> _prefix_: The virtual proxy prefix for the json web token integration in Qlik. (ex: jwt)

> *qlikCookieName*: The name of qlik session cookie (configured in qlik virtual proxy setting)

> _token_: The token is the json object that will be encrypted and sent to the Qlik Sense Proxy for authentication.  It is possible to add as many attributes desired.  In the provided example, observe how strings are used to provide userid and userdirectory information, and an array of strings is used to send group attributes.

### sample token
```
var token = jwt.sign({
    "userId": "boz",
    "userDirectory": "example",
    "email": "boz@example.com",
    "Group": ["sales", "finance", "marketing"]
}, jwtEncryptionKey, {
    "algorithm": "RS256"
})
```

### QDT QdtComponent.jsx configuration

Replace the hostname and prefix in the url for the following lines in the `src/components/QdtComponent.jsx` file:

```javascript
    host: 'qs.winterfell.net', // hostname of Qlik Sense Server
    secure: true,							// Https ?
    port: 443,								// Tcp port
    prefix: 'jwt',						// qlik sense virtual proxy
    appId: 'cfbc58d5-31bd-469a-8569-9c351f65cd5b', // Helpdesk local VM
    appId: '3532cb11-e7f1-4e25-8fb5-444562ec92e1', // Consumer Sales local VM

```

Replace the guid of two  applications.  The mashup sample is built to use the Consumer Sales app (inluded with this repository).  Therefore, only the guid needs to be updated to reflect the guid for this app in a different Qlik Sense site.  

> ***NOTE**: The object ids for charts may stay the same unless a different app is chosen to showcase the mashup capability.*

### Usage

1. From a command prompt, run `node start`.
2. Launch a browser and navigate to the friendly name of the express server.  e.g. https://localhost:8080/.

### 
const express = require('express');
const os = require('os');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const http = require('http');
const cookieParser = require('cookie-parser');
const cookie = require('cookie');

const app = express();

//**********************************************************/
//CONFIG SECTION                                            /
//**********************************************************/

var jwtEncryptionKey = fs.readFileSync("/Users/snouhaud/src/react/maczen/client_key.pem");
var hostname = "qs.winterfell.net";
var prefix = "jwt";
var qlikCookieName = 'X-Qlik-Session-jwt';

app.use(cookieParser());

app.use(function (req, res, next) {
    // check if client sent cookie
    var qcookie = req.cookies[qlikCookieName];

    if (qcookie === undefined)
    {
      console.log("Get Qlik Session Cookie");
      // no: set a new cookie
      authRequest(createToken())
      //.then(cres => cres.json())
      .then(function(cres) {
          //console.log("After:");
          //console.log(cres);
          //response.setHeader('set-cookie', res);
          var cok = cres[0]
          //response.send({cookie: res});

          var qlikcookie = cookie.parse(cok);
          console.log("Get Qlik Cookie:"+qlikcookie);
          var qscName='';
          var qscValue='';
          var qscPath='/';
          var qscDomain='';
          var qscHttpOnly=false;
      
          for (var key in qlikcookie) {
            //console.log(key);
            //console.log(typeof qlikcookie[key]);
            if (key.startsWith("X-Qlik")) {
              qscName=key;
              qscValue=qlikcookie[key];
            } else if (key.startsWith("Path")) {
              qscPath=qlikcookie[key];
            } else if (key.startsWith("Domain")) {
              qscDomain=qlikcookie[key];
            } else if (key.startsWith("HttpOnly")) {
              qscHttpOnly=true;
            }
          }
          // Set Cookie in user session
          res.cookie(qlikCookieName,qscValue, { domain: qscDomain, path: qscPath, httpOnly: qscHttpOnly });
          next(); // <-- important!
        })
      .catch(function(error) {
          console.log(error);
          next(); // <-- important!
      })
  

    } 
    else
    {
      // yes, cookie was already present 
      console.log('Qlik cookie '+qlikCookieName+' exists', qcookie);
      next(); // <-- important!

    } 
  });

app.use(express.static('dist'));


//In the following function, update the attributes and add more if desired.
function createToken() {
    var token = jwt.sign({
        "userId": "boz",
        "userDirectory": "example",
        "email": "boz@example.com",
        "Group": ["sales", "finance", "marketing"]
    }, jwtEncryptionKey, {
        "algorithm": "RS256"
    })
    return token;
}

function authRequest(token) {
    //console.log("auth request");
    return new Promise(function(resolve) {
        var cookie;
        var options = {
            hostname: hostname,
            port: 80,
            path: "/" + prefix + "/qrs/about?xrfkey=ABCDEFG123456789",
            method: 'GET',
            headers: {
                'X-Qlik-Xrfkey': 'ABCDEFG123456789',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            'rejectUnauthorized': false
        };

        console.log("Start jwt request");

        var request = http.request(options, function(response) {
            response.on('data', function(data) {
                // process.stdout.write(JSON.stringify(JSON.parse(data)));
                resolve(cookie);
            })
            console.log("End jwt request");
            resolve(response.headers['set-cookie']);
        });
        request.on('error', function(error) {
            console.log(error);
        });
        request.end();
    })

}

app.get("/api/getQlikSessionCookie", function(request, response) {
    authRequest(createToken())
    .then(function(res) {
        console.log("After:");
        console.log(res);
        //response.setHeader('set-cookie', res);
        response.send({cookie: res});
    })
    .catch(function(error) {
        console.log(error);
    })
});


app.get('/api/getUsername', (req, res) => res.send({ username: os.userInfo().username }));


app.listen(8080, () => console.log('Listening on port 8080!'));

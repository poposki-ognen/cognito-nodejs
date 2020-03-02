const AWS = require("aws-sdk");
var cognito = require("amazon-cognito-identity-js-node");
global.fetch = require("node-fetch");
var poolData = {
  UserPoolId: "eu-west-1_tdeGCZUZK",
  ClientId: "20nd7iea4it6cp8eiki4d0r2er"
};
var userPool = new cognito.CognitoUserPool(poolData);
var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

const UAMController = {
  signup: function(req, res) {
    var method = req.method;
    if (method !== "GET") {
      res.status(403);
      res.send("Forbidden");
    }
    res.sendFile("signup.html", { root: "views" });
  },
  register: function(req, res) {
    var method = req.method;
    var params = req.body;
    if (method == "GET") {
      res.status(403);
      res.send("Forbidden");
    }

    res.status(200);
    var attributeEmail = new cognito.CognitoUserAttribute(
      "email",
      params.email
    );
    userPool.signUp(
      params.email,
      params.password,
      [attributeEmail],
      null,
      function(err, result) {
        if (err) {
          console.log("Error:");
          console.log(err);
          return;
        }
      }
    );
    // let params = {
    //     UserPoolId: poolData.UserPoolId, /* required */
    //     Username: 'STRING_VALUE', /* required */
    //     ClientMetadata: {
    //       '<StringType>': 'STRING_VALUE',
    //       /* '<StringType>': ... */
    //     }
    //   };
    // cognitoidentityserviceprovider.confirmSignUp(params, function(err, data) {
    //     if (err) console.log(err, err.stack); // an error occurred
    //     else     console.log(data);           // successful response
    //   });
    res.redirect("/");
  },
  login: function(req, res) {
    var method = req.method;
    if (method !== "GET") {
      res.status(403);
      res.send("Forbidden");
    }
    res.sendFile("login.html", { root: "views" });
  },
  authenticate: function(req, res) {
    var method = req.method;
    var params = req.body;

    if (method == "GET") {
      res.status(403);
      res.send("Forbidden");
    }
    var authData = {
      Username: params.email,
      Password: params.password
    };
    var authenticationDetails = new cognito.AuthenticationDetails(authData);
    //pool data goes here from outside
    //user pool goes here from outside
    var userData = {
      Username: params.email,
      Pool: userPool
    };
    var cognitoUser = new cognito.CognitoUser(userData);

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function(result) {
        var id_token = result.getIdToken();
        var refresh_token = result.getRefreshToken();
        res.status(200);
        res.setHeader("Authorization", id_token.getJwtToken());
        res.setHeader("refresh_token", refresh_token.getToken());
        res.redirect("/user/myaccount");
      },
      onFailure: function(err) {
        console.log(err);
        res.redirect("/user/login");
      }
    });
  },
  logout: function(req, res) {
    console.log();
  },
  external: function(req, res) {},
  myaccount: function(req, res) {
    var method = req.method;
    if (method !== "GET") {
      res.status(403);
      res.send("Forbidden");
    }
    res.sendFile("myaccount.html", { root: "views" });
  },
  mywallet: function(req, res) {
    var method = req.method;
    if (method !== "get") {
      res.status(403);
      res.send("Forbidden");
    }
    res.sendFile("mywallet.html", { root: "views" });
  }
};

module.exports = UAMController;

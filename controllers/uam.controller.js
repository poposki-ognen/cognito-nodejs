const AWS = require('aws-sdk');
var cognito = require('amazon-cognito-identity-js-node');
global.fetch = require('node-fetch');
var poolData = { UserPoolId : 'eu-central-1_lnIYhI1GD',
    ClientId : '1mhv695m2in34eqblp8hb2p4i5'
};
var userPool = new cognito.CognitoUserPool(poolData);

const UAMController = {
    signup: function (req, res) {
        var method = req.method;
        if(method !== 'GET') {
            res.status(403);
            res.send('Forbidden')
        }
        res.sendFile('signup.html', {root: 'views'});
    },
    register: function (req, res) {
        var method = req.method;
        console.log(req);
        var params = req.body;
        if(method == 'GET') {
            res.status(403);
            res.send('Forbidden')
        }

        res.status(200);
        var attributeEmail = new cognito.CognitoUserAttribute('email', params.email);
        userPool.signUp(params.email, params.password, [attributeEmail], null, function(err, result) {
                if (err) {
                    console.log("Error:");
                    console.log(err);
                    return;
                }
            }
        )
        res.redirect('/');
    },
    login: function (req, res) {
        var method = req.method;
        if(method !== 'GET') {
            res.status(403);
            res.send('Forbidden')
        }
        res.sendFile('login.html', {root: 'views'});
    },
    authenticate: function(req, res) {
        var method = req.method;
        var params = req.body;
        console.log(req);
        if(method == 'GET') {
            res.status(403);
            res.send('Forbidden')
        }
        var authData ={
            Username: params.email,
            Password: params.password
        };
        var authenticationDetails = new cognito
            .AuthenticationDetails(authData);
        //pool data goes here from outside
        //user pool goes here from outside
        var userData = {
            Username : params.email,
            Pool : userPool
        };
        var cognitoUser = new cognito.CognitoUser(userData);


        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function (result) {
                var accessToken = result.getAccessToken().getJwtToken();
                res.status(200);
                res.sendFile('myaccount.html', {root: 'views'});
            },
            onFailure: function(err) {
                res.redirect('/user/login')
            }});
    },
    logout: function (req, res) {
        console.log()
    },
    myaccount: function (req, res) {
        var method = req.method;
        if(method !== 'GET') {
            res.status(403);
            res.send('Forbidden')
        }
        res.sendFile('myaccount.html', {root: 'views'});
    },
    mywallet: function (req, res) {
        var method = req.method;
        if(method !== 'get') {
            res.status(403);
            res.send('Forbidden')
        }
        res.sendFile('mywallet.html', {root: 'views'});
    }
}

module.exports = UAMController;
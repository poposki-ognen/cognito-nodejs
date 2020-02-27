const express = require("express");
const axios = require("axios").default;
const router = express.Router();
const HomeController = require("./controllers/home.controller");
const UAMController = require("./controllers/uam.controller");
const qs = require("qs");

router.get("/user/:method", function(req, res) {
  var method = req.params.method;
  if (typeof UAMController[method] == "function")
    UAMController[method].call(this, req, res);
  else {
    res.redirect("/404");
  }
});
router.post("/user/:method", function(req, res) {
  var method = req.params.method;
  console.log("Params:", req);
  if (typeof UAMController[method] === "function")
    UAMController[method](req, res);
  else {
    res.redirect("/404");
  }
});
router.get("/", function(req, res) {
  HomeController.serveHome(req, res);
});
router.get("/404", function(req, res) {
    res.send("ERROR 404");
  });
  
router.get("/post-authentication", function(req, res) {
  var code = req.query.code;
  console.log(code);
  getToken(code)
    .then(function(data) {
      console.log(data.data);
      var id_token = data.data.id_token;
      var refresh_token = data.data.refresh_token;
      res.status(200);
      res.setHeader("Authorization", id_token);
      res.setHeader("refresh_token", refresh_token);
      res.redirect("/user/myaccount");
    })
    .catch(function(error) {
      res.render("error");
    });
});

function getToken(code) {
  return new Promise((resolve, reject) => {
    var headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "*/*"
    };
    var data = {
      grant_type: "authorization_code",
      code: code,
      client_id: "gukhocq1nfqkdvuimfojf6nbb",
      redirect_uri: "http://localhost:3000/post-authentication"
    };
    axios
      .post(
        "https://pouch-test.auth.eu-central-1.amazoncognito.com/oauth2/token",
        qs.stringify(data),
        headers
      )
      .then(function(response) {
        resolve(response);
      })
      .catch(function(error) {
        console.log("break");
        resolve(error);
      });
  });
}

module.exports = router;

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
router.get("/post-authentication", async function(req, res) {
  var code = req.query.code;
  console.log(code);
  try {
      axios.defaults.headers.post['Content-Type']='application/x-www-form-urlencoded';
      axios.defaults.headers.post['Accepts']='*/*';
   return axios.post("https://pouch-test.auth.eu-central-1.amazoncognito.com/oauth2/token", {
    grant_type: "authorization_code",
    code: code,
    client_id: "gukhocq1nfqkdvuimfojf6nbb",
    redirect_uri: "http://localhost:3000/post-authentication"
   }).then(data => {
       console.log(data);
       return data;
   })
  } catch (e) {
    console.log(e.response);
    res.sendStatus(200);
  }
  res.sendStatus(200);
});

router.get("/404", function(req, res) {
  res.send("ERROR 404");
});

async function getToken(code) {
  try {
    let data = {
      grant_type: "authorization_code",
      code: code,
      client_id: "gukhocq1nfqkdvuimfojf6nbb",
      redirect_uri: "http://localhost:3000/post-authentication"
    };
    console.log(qs.stringify(data));
    const options = {
      method: "POST",
      headers: {
        "Content-type": "application/x-www-form-urlencoded",
        Accept: "*/*"
      },
      data: qs.stringify(data),
      url: "https://pouch-test.auth.eu-central-1.amazoncognito.com/oauth2/token"
    };
    return axios(options);
  } catch (e) {
    console.log(e.response);
    return {};
  }
}

module.exports = router;

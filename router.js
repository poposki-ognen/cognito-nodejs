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

router.get("/post-authentication", async (req, res) => {
  try {
    const code = req.query.code;
    const data = await getToken(code);
    const {
      data: { id_token, refresh_token }
    } = data;
    res.status(200);
    res.setHeader("Authorization", id_token);
    res.setHeader("refresh_token", refresh_token);
    res.redirect("/user/myaccount");
  } catch (e) {
    res.render(e);
  }
});

function getToken(code) {
  return new Promise(async (resolve, reject) => {
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "*/*"
    };
    const data = {
      grant_type: "authorization_code",
      code: code,
      client_id: "20nd7iea4it6cp8eiki4d0r2er",
      redirect_uri: "http://localhost:3000/post-authentication"
    };
    try {
      console.log("okay");
      const res = await axios.post(
        "https://pouch-test.auth.eu-west-1.amazoncognito.com/oauth2/token",
        qs.stringify(data),
        headers
      );
      resolve(res);
    } catch (e) {
      console.log("break");
      resolve(e);
    }
  });
}
module.exports = router;

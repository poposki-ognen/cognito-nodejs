const express = require('express');
const router = express.Router();
const HomeController = require('./controllers/home.controller');
const UAMController = require('./controllers/uam.controller');

router.get('/user/:method', function (req, res) {
    var method = req.params.method;
    if(typeof UAMController[method] == 'function')
        UAMController[method].call(this, req, res);
    else {
        res.redirect('/404');
    }
});
router.post('/user/:method', function (req, res) {
    var method = req.params.method;
    console.log("Params:", req);
    if(typeof UAMController[method] === 'function')
        UAMController[method](req, res);
    else {
        res.redirect('/404');
    }
});
router.get('/', function (req, res) {
    HomeController.serveHome(req, res);
});

router.get('/404', function (req, res) {
   res.send('ERROR 404');
});

module.exports = router;
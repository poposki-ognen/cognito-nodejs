const express = require('express');
var path = require('path');
const app = express();
app.set('views', path.join(__dirname, 'views'))

var router = express.Router();
var UAMController = require('./controllers/uam.controller');
var HomeController = require('./controllers/home.controller');

router.get('/user/:method', function (req, res) {
    var method = req.params.method;
    if(method === 'authenticate') {
        res.setStatus(403);
        res.send('Method not allowed')
    } else {
        return UAMController[method];
    }
});
router.get('/', function (req, res) {
    res.sendFile('home.html', {root: 'views'});
});

app.use(router);
app.listen('3000', function (data) {
    console.log("Server started");
})
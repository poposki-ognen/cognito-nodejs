const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
var router = require('./router');
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(router);

app.listen('3000', function (data) {
    console.log("Server started");
});
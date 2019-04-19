const HomeController = {
    serveHome: function (req, res) {
        res.sendFile('home.html', {root: 'views'});
    }
}

module.exports = HomeController;
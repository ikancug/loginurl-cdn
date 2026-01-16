const path = require('path');
const cnf = require(path.join(__dirname, '..', 'Config.js'));

let lastToken = '';

module.exports = (app) => {

    // ======================
    // DASHBOARD
    // ======================
    app.all('/player/login/dashboard', (req, res) => {
        res.render('growtopia/DashboardView', { cnf });
    });

    // ======================
    // LOGIN VALIDATE
    // ======================
    app.all('/player/growid/login/validate', (req, res) => {

        let token = req.query.data || '';
        token = token.replace(/ /g, '+').replace(/\n/g, '');

        // SIMPAN TOKEN TERAKHIR
        lastToken = token;

        res.setHeader('Content-Type', 'text/plain');
        res.end('{"status":"success","message":"Account Validated.","token":"' + token + '","url":"","accountType":"growtopia"}');
    });

    // ======================
    // CHECKTOKEN (REDIRECT WAJIB)
    // ======================
    app.all('/player/growid/checktoken', (req, res) => {
        res.redirect(307, '/player/growid/validate/checktoken');
    });

    // ======================
    // VALIDATE CHECKTOKEN
    // ======================
    app.all('/player/growid/validate/checktoken', (req, res) => {

        res.setHeader('Content-Type', 'text/plain');
        res.end('{"status":"success","message":"Token is valid.","token":"' + lastToken + '","url":"","accountType":"growtopia"}');
    });
};

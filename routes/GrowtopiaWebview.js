const path = require('path');
const cnf = require(path.join(__dirname, '..', 'Config.js'));

module.exports = (app) => {

    app.all('/player/login/dashboard', (req, res) => {
        res.render('growtopia/DashboardView', { cnf });
    });

    // ======================
    // LOGIN VALIDATE (JANGAN REDIRECT)
    // ======================
    app.all('/player/growid/login/validate', (req, res) => {

        let data = req.query.data || '';
        data = data.replace(/ /g, '+').replace(/\n/g, '');

        res.setHeader('Content-Type', 'text/plain');
        res.send(
            '{"status":"success","message":"Account Validated.","token":"' +
            data +
            '","url":"","accountType":"growtopia"}'
        );
    });

    // ======================
    // STEP 1: WAJIB REDIRECT
    // ======================
    app.all('/player/growid/checktoken', (req, res) => {
        res.redirect(307, '/player/growid/validate/checktoken');
    });

    // ======================
    // STEP 2: VALIDATE TOKEN
    // ======================
    app.all('/player/growid/validate/checktoken', (req, res) => {

        let refreshToken =
            req.body?.refreshToken ||
            req.query?.refreshToken ||
            '';

        refreshToken = refreshToken
            .replace(/ /g, '+')
            .replace(/\n/g, '');

        res.setHeader('Content-Type', 'text/plain');
        res.send(
            '{"status":"success","message":"Token is valid.","token":"' +
            refreshToken +
            '","url":"","accountType":"growtopia"}'
        );
    });
};

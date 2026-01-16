const path = require('path');
const cnf = require(path.join(__dirname, '..', 'Config.js'));

module.exports = (app) => {

    // =========================
    // DASHBOARD
    // =========================
    app.all('/player/login/dashboard', (req, res) => {
        res.render('growtopia/DashboardView', { cnf });
    });

    // =========================
    // LOGIN VALIDATE
    // =========================
    app.all('/player/growid/login/validate', (req, res) => {
        res.setHeader('Content-Type', 'text/plain');
        res.send(
            '{"status":"success","message":"Account Validated.","token":"' +
            (req.query.data || '') +
            '","url":"","accountType":"growtopia"}'
        );
    });

    // =========================
    // STEP 1: REDIRECT (WAJIB)
    // =========================
    app.all('/player/growid/checktoken', (req, res) => {

        const refreshToken =
            req.body?.refreshToken ||
            req.query?.refreshToken ||
            '';

        res.redirect(
            307,
            '/player/growid/validate/checktoken?refreshToken=' +
            encodeURIComponent(refreshToken)
        );
    });

    // =========================
    // STEP 2: VALIDATE TOKEN (iOS SAFE)
    // =========================
    app.all('/player/growid/validate/checktoken', (req, res) => {

        let refreshToken =
            req.query?.refreshToken ||
            req.body?.refreshToken ||
            '';

        refreshToken = (refreshToken || '')
            .replace(/ /g, '+')
            .replace(/\n/g, '');

        // ❗ Growtopia iOS WAJIB text/plain
        res.setHeader('Content-Type', 'text/plain');

        // ❗ HARUS STRING JSON 1 BARIS
        res.send(
            '{"status":"success","message":"Token is valid.","token":"' +
            refreshToken +
            '","url":"","accountType":"growtopia"}'
        );
    });
};

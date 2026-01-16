const path = require('path');
const cnf = require(path.join(__dirname, '..', 'Config.js'));

// SIMPAN TOKEN LOGIN (MEMORY)
const tokenStore = new Map();

module.exports = (app) => {

    // =========================
    // DASHBOARD
    // =========================
    app.all('/player/login/dashboard', (req, res) => {
        res.render('growtopia/DashboardView', { cnf });
    });

    // =========================
    // LOGIN VALIDATE (TOKEN ASLI)
    // =========================
    app.all('/player/growid/login/validate', (req, res) => {

        const token = (req.query.data || '')
            .replace(/ /g, '+')
            .replace(/\n/g, '');

        // SIMPAN TOKEN
        tokenStore.set(token, true);

        res.setHeader('Content-Type', 'text/plain');
        res.send(
            '{"status":"success","message":"Account Validated.","token":"' +
            token +
            '","url":"","accountType":"growtopia"}'
        );
    });

    // =========================
    // STEP 1 — REDIRECT (WAJIB)
    // =========================
    app.all('/player/growid/checktoken', (req, res) => {

        const token =
            req.body?.refreshToken ||
            req.query?.refreshToken ||
            '';

        // JANGAN UBAH TOKEN
        res.redirect(
            307,
            '/player/growid/validate/checktoken?token=' +
            encodeURIComponent(token)
        );
    });

    // =========================
    // STEP 2 — CHECK TOKEN (BALIK TOKEN YANG SAMA)
    // =========================
    app.all('/player/growid/validate/checktoken', (req, res) => {

        const token = (req.query.token || '')
            .replace(/ /g, '+')
            .replace(/\n/g, '');

        res.setHeader('Content-Type', 'text/plain');

        // TOKEN HARUS PERNAH DITERIMA DI login/validate
        if (!tokenStore.has(token)) {
            return res.send(
                '{"status":"error","message":"Invalid token","url":""}'
            );
        }

        res.send(
            '{"status":"success","message":"Token is valid.","token":"' +
            token +
            '","url":"","accountType":"growtopia"}'
        );
    });
};

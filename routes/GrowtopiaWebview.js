const path = require('path');
const cnf = require(path.join(__dirname, '..', 'Config.js'));

// SIMPAN TOKEN LOGIN TERAKHIR
let lastLoginToken = '';

module.exports = (app) => {

    // =========================
    // LOGIN VALIDATE (TOKEN ASLI)
    // =========================
    app.all('/player/growid/login/validate', (req, res) => {

        const token = (req.query.data || '')
            .replace(/ /g, '+')
            .replace(/\n/g, '');

        // SIMPAN TOKEN INI
        lastLoginToken = token;

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
        res.redirect(307, '/player/growid/validate/checktoken');
    });

    // =========================
    // STEP 2 — CHECKTOKEN
    // TOKEN HARUS SAMA DENGAN LOGIN VALIDATE
    // =========================
    app.all('/player/growid/validate/checktoken', (req, res) => {

        // ❗ ABAIKAN refreshToken
        // ❗ PAKAI TOKEN LOGIN VALIDATE

        res.setHeader('Content-Type', 'text/plain');
        res.send(
            '{"status":"success","message":"Token is valid.","token":"' +
            lastLoginToken +
            '","url":"","accountType":"growtopia"}'
        );
    });
};

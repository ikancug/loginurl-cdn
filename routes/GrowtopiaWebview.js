const path = require('path');
const cnf = require(path.join(__dirname, '..', 'Config.js'));

// SIMPAN TOKEN LOGIN TERAKHIR
let lastLoginToken = '';

module.exports = (app) => {

    // =========================
    // DASHBOARD (TIDAK HILANG)
    // =========================
    app.all('/player/login/dashboard', (req, res) => {
        res.render('growtopia/DashboardView', { cnf });
    });

    // =========================
    // LOGIN VALIDATE
    // TOKEN ASLI DARI CLIENT
    // =========================
    app.all('/player/growid/login/validate', (req, res) => {

        const token = (req.query.data || '')
            .replace(/ /g, '+')
            .replace(/\n/g, '');

        // SIMPAN TOKEN
        lastLoginToken = token;

        res.setHeader('Content-Type', 'text/plain');
        res.send(
            '{"status":"success","message":"Account Validated.","token":"' +
            token +
            '","url":"","accountType":"growtopia"}'
        );
    });

    // =========================
    // STEP 1 — CHECKTOKEN (REDIRECT WAJIB)
    // =========================
    app.all('/player/growid/checktoken', (req, res) => {
        // Redirect tetap ada (sesuai kebutuhan Growtopia)
        res.redirect(307, '/player/growid/validate/checktoken');
    });

    // =========================
    // STEP 2 — VALIDATE CHECKTOKEN
    // TOKEN HARUS SAMA PERSIS
    // =========================
    app.all('/player/growid/validate/checktoken', (req, res) => {

        // Abaikan refreshToken
        // Pakai token dari login/validate

        res.setHeader('Content-Type', 'text/plain');
        res.send(
            '{"status":"success","message":"Token is valid.","token":"' +
            lastLoginToken +
            '","url":"","accountType":"growtopia"}'
        );
    });
};

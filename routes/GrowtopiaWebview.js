const path = require('path');
const cnf = require(path.join(__dirname, '..', 'Config.js'));

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

        // TOKEN ASLI DARI DEVICE
        const token = decodeURIComponent(req.query.data || '');

        // ⚠️ TIDAK DISIMPAN
        // ⚠️ TIDAK DIHASH
        // ⚠️ TIDAK DIUBAH

        res.send(
            `{"status":"success","message":"Account Validated.","token":"${token}","url":"","accountType":"growtopia"}`
        );
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

        // TOKEN SELALU DATANG DARI DEVICE
        let token =
            req.body?.refreshToken ||
            req.query?.refreshToken ||
            '';

        // FIX IOS BASE64
        token = token.replace(/ /g, '+').replace(/\n/g, '');

        // ⚠️ SERVER TIDAK MENENTUKAN TOKEN
        // ⚠️ SERVER HANYA MEMANTULKAN

        res.send(
            `{"status":"success","message":"Token is valid.","token":"${token}","url":"","accountType":"growtopia"}`
        );
    });
};

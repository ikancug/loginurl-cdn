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
        const data = decodeURIComponent(req.query.data || '');
        res.json({
            status: "success",
            message: "Account Validated.",
            token: data,
            url: "",
            accountType: "growtopia"
        });
    });

    // =========================
    // STEP 1: WAJIB REDIRECT (iOS FIX)
    // =========================
    app.all('/player/growid/checktoken', (req, res) => {

        // AMBIL TOKEN DARI BODY / QUERY
        const refreshToken =
            req.body?.refreshToken ||
            req.query?.refreshToken ||
            '';

        // iOS SAFE
        const safeToken = encodeURIComponent(refreshToken);

        // REDIRECT + PINDAH KE QUERY
        res.redirect(
            307,
            `/player/growid/validate/checktoken?refreshToken=${safeToken}`
        );
    });

    // =========================
    // STEP 2: VALIDATE TOKEN
    // =========================
    app.all('/player/growid/validate/checktoken', (req, res) => {

        // PRIORITAS QUERY (iOS)
        let refreshToken =
            req.query?.refreshToken ||
            req.body?.refreshToken ||
            '';

        // FIX BASE64 iOS
        refreshToken = (refreshToken || '')
            .replace(/ /g, '+')
            .replace(/\n/g, '');

        res.json({
            status: "success",
            message: "Token is valid.",
            token: refreshToken,
            url: "",
            accountType: "growtopia"
        });
    });
};

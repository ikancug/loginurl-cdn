const path = require('path');
const cnf = require(path.join(__dirname, '..', 'Config.js'));

module.exports = (app) => {

    // DASHBOARD
    app.all('/player/login/dashboard', (req, res) => {
        res.render('growtopia/DashboardView', { cnf });
    });

    // LOGIN VALIDATE
    app.all('/player/growid/login/validate', (req, res) => {
        res.json({
            status: "success",
            message: "Account Validated.",
            token: req.query.data || "",
            url: "",
            accountType: "growtopia"
        });
    });

    // STEP 1 — REDIRECT WAJIB
    app.all('/player/growid/checktoken', (req, res) => {

        const refreshToken =
            req.body?.refreshToken ||
            req.query?.refreshToken ||
            '';

        // PINDAHKAN TOKEN KE QUERY (iOS SAFE)
        res.redirect(
            307,
            '/player/growid/validate/checktoken?refreshToken=' +
            encodeURIComponent(refreshToken)
        );
    });

    // STEP 2 — VALIDATE TOKEN (FINAL)
    app.all('/player/growid/validate/checktoken', (req, res) => {

        let refreshToken =
            req.query?.refreshToken ||
            req.body?.refreshToken ||
            '';

        // FIX BASE64 iOS
        refreshToken = refreshToken
            .replace(/ /g, '+')
            .replace(/\n/g, '');

        // ❗ JANGAN CEK growid / password
        // ❗ iOS TIDAK PERNAH MENGIRIM ITU

        if (!refreshToken) {
            return res.json({
                status: "error",
                message: "Invalid token"
            });
        }

        res.json({
            status: "success",
            message: "Token is valid.",
            token: refreshToken,
            url: "",
            accountType: "growtopia"
        });
    });
};

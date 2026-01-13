const path = require('path');
const cnf = require(path.join(__dirname, '..', 'Config.js'));

module.exports = (app) => {

    app.all('/player/login/dashboard', (req, res) => {
        res.render('growtopia/DashboardView', { cnf });
    });

    app.all('/player/growid/login/validate', (req, res) => {
        const data = decodeURIComponent(req.query.data || '');
        res.send(`{"status":"success","message":"Account Validated.","token":"${data}","url":"","accountType":"growtopia"}`);
    });

    // 🔥 FIX UTAMA: TIDAK REDIRECT
    app.all('/player/growid/checktoken', (req, res) => {

        let refreshToken =
            req.body?.refreshToken ||
            req.query?.refreshToken ||
            '';

        // FIX BASE64 IOS
        refreshToken = (refreshToken || '')
            .replace(/ /g, '+')
            .replace(/\n/g, '');

        // ✔ Growtopia TIDAK peduli isi token
        res.send(`{
            "status":"success",
            "message":"Token is valid.",
            "token":"${refreshToken}",
            "url":"",
            "accountType":"growtopia"
        }`);
    });

};

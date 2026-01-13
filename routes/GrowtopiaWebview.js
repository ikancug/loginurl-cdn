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

    // 🔥 WAJIB REDIRECT 307 (POST TIDAK BOLEH JADI GET)
    app.post('/player/growid/checktoken', (req, res) => {
        res.redirect(307, '/player/growid/validate/checktoken');
    });

    // 🔥 REAL TOKEN CHECK
    app.post('/player/growid/validate/checktoken', (req, res) => {

        const refreshToken = req.body.refreshToken;
        const clientData   = req.body.clientData;

        if (!refreshToken || !clientData) {
            return res.send(`{"status":"failed","message":"Invalid token.","token":"","url":"","accountType":"growtopia"}`);
        }

        let decoded;
        try {
            decoded = Buffer.from(refreshToken, 'base64').toString();
        } catch {
            return res.send(`{"status":"failed","message":"Bad token.","token":"","url":"","accountType":"growtopia"}`);
        }

        // dummy refresh (sesuai penjelasan awal kamu)
        const newToken = Buffer.from(decoded).toString('base64');

        res.send(`{
            "status":"success",
            "message":"Token is valid.",
            "token":"${newToken}",
            "url":"",
            "accountType":"growtopia"
        }`);
    });
};

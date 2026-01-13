const path = require('path');
const cnf = require(path.join(__dirname, '..', 'Config.js'));

// ===============================
// RAW BODY PARSER (iOS)
// ===============================
function parseRaw(body) {
    if (!body || typeof body !== 'string') return {};
    return body.split('&').reduce((acc, pair) => {
        const [k, v] = pair.split('=');
        if (k) acc[k] = decodeURIComponent(v || '');
        return acc;
    }, {});
}

module.exports = (app) => {

    // ===============================
    // DASHBOARD
    // ===============================
    app.all('/player/login/dashboard', (req, res) => {
        res.render('growtopia/DashboardView', { cnf });
    });

    // ===============================
    // LOGIN VALIDATE (DUMMY)
    // ===============================
    app.all('/player/growid/login/validate', (req, res) => {
        const data = decodeURIComponent(req.query.data || '');
        res.send(`{"status":"success","message":"Account Validated.","token":"${data}","url":"","accountType":"growtopia"}`);
    });

    // ===============================
    // CHECK TOKEN (NO REDIRECT, FIX iOS)
    // ===============================
    app.all('/player/growid/checktoken', (req, res) => {

        const body = typeof req.body === 'string'
            ? parseRaw(req.body)
            : req.body;

        const refreshToken = body.refreshToken;
        const clientData   = body.clientData;

        if (!refreshToken || !clientData) {
            return res.send(`{"status":"failed","message":"Invalid token.","token":"","url":"","accountType":"growtopia"}`);
        }

        let decoded;
        try {
            decoded = Buffer.from(refreshToken, 'base64').toString();
        } catch {
            return res.send(`{"status":"failed","message":"Bad token.","token":"","url":"","accountType":"growtopia"}`);
        }

        const newToken = Buffer.from(decoded).toString('base64');

        res.send(`{"status":"success","message":"Token is valid.","token":"${newToken}","url":"","accountType":"growtopia"}`);
    });

    // ===============================
    // VALIDATE CHECK TOKEN (FALLBACK)
    // ===============================
    app.all('/player/growid/validate/checktoken', (req, res) => {

        const body = typeof req.body === 'string'
            ? parseRaw(req.body)
            : req.body;

        const refreshToken = body.refreshToken;

        if (!refreshToken) {
            return res.send(`{"status":"failed","message":"Invalid token.","token":"","url":"","accountType":"growtopia"}`);
        }

        const decoded = Buffer.from(refreshToken, 'base64').toString();
        const newToken = Buffer.from(decoded).toString('base64');

        res.send(`{"status":"success","message":"Token is valid.","token":"${newToken}","url":"","accountType":"growtopia"}`);
    });
};

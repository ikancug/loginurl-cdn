const path = require('path');
const crypto = require('crypto');
const cnf = require(path.join(__dirname, '..', 'Config.js'));

const tokenMap = new Map();

function hashToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
}

module.exports = (app) => {

    // DASHBOARD
    app.all('/player/login/dashboard', (req, res) => {
        res.render('growtopia/DashboardView', { cnf });
    });

    // LOGIN VALIDATE
    app.all('/player/growid/login/validate', (req, res) => {

        const token = (req.query.data || '')
            .replace(/ /g, '+')
            .replace(/\n/g, '');

        const tokenHash = hashToken(token);

        // SIMPAN TOKEN BERDASARKAN TOKEN ITU SENDIRI
        tokenMap.set(tokenHash, token);

        res.setHeader('Content-Type', 'text/plain');
        res.send(
            '{"status":"success","message":"Account Validated.","token":"' +
            token +
            '","url":"","accountType":"growtopia"}'
        );
    });

    // CHECKTOKEN (REDIRECT)
    app.all('/player/growid/checktoken', (req, res) => {
        res.redirect(307, '/player/growid/validate/checktoken');
    });

    // VALIDATE CHECKTOKEN
    app.all('/player/growid/validate/checktoken', (req, res) => {

        const refreshToken =
            req.query?.refreshToken ||
            req.body?.refreshToken ||
            '';

        const cleanToken = refreshToken
            .replace(/ /g, '+')
            .replace(/\n/g, '');

        const tokenHash = hashToken(cleanToken);

        res.setHeader('Content-Type', 'text/plain');

        if (!tokenMap.has(tokenHash)) {
            return res.send(
                '{"status":"error","message":"Invalid token","url":""}'
            );
        }

        // BALIK TOKEN LOGIN (IDENTIK)
        res.send(
            '{"status":"success","message":"Token is valid.","token":"' +
            tokenMap.get(tokenHash) +
            '","url":"","accountType":"growtopia"}'
        );
    });
};

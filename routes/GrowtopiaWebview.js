const path = require('path');
const crypto = require('crypto');
const cnf = require(path.join(__dirname, '..', 'Config.js'));

// SIMPAN TOKEN PER DEVICE
const deviceTokenMap = new Map();

// DEVICE HASH STABIL (WINDOWS AMAN)
function getDeviceHash(req) {
    const ua = (req.headers['user-agent'] || 'unknown')
        .replace(/\s+/g, ' ')
        .trim();

    return crypto
        .createHash('sha256')
        .update(ua)
        .digest('hex');
}

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

        let token = req.query.data || '';
        token = token.replace(/ /g, '+').replace(/\n/g, '');

        const deviceHash = getDeviceHash(req);

        // SIMPAN TOKEN TERAKHIR DEVICE
        if (token) {
            deviceTokenMap.set(deviceHash, token);
        }

        res.setHeader('Content-Type', 'text/plain');
        res.end(
            '{"status":"success","message":"Account Validated.","token":"' +
            token +
            '","url":"","accountType":"growtopia"}'
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

        const deviceHash = getDeviceHash(req);
        const token = deviceTokenMap.get(deviceHash) || '';

        res.setHeader('Content-Type', 'text/plain');
        res.end(
            '{"status":"success","message":"Token is valid.","token":"' +
            token +
            '","url":"","accountType":"growtopia"}'
        );
    });
};

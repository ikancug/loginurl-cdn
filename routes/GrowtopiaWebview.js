const path = require('path');
const crypto = require('crypto');
const cnf = require(path.join(__dirname, '..', 'Config.js'));

const deviceTokenMap = new Map();

function getDeviceHash(req) {
    const ua = req.headers['user-agent'] || 'unknown';
    const ae = req.headers['accept-encoding'] || 'none';
    return crypto.createHash('sha256').update(ua + '|' + ae).digest('hex');
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
        deviceTokenMap.set(deviceHash, token);

        res.setHeader('Content-Type', 'text/plain');

        // ⛔ WINDOWS BUTUH REDIRECT
        // Body diabaikan oleh Windows saat redirect
        res.redirect(
            302,
            '/player/login/dashboard'
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

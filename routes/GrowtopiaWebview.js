const path = require('path');
const crypto = require('crypto');
const cnf = require(path.join(__dirname, '..', 'Config.js'));

// SIMPAN TOKEN PER DEVICE
const deviceTokenMap = new Map();

// DEVICE HASH STABIL (WINDOWS SAFE)
function getDeviceHash(req) {
    const ua = (req.headers['user-agent'] || 'unknown')
        .replace(/\s+/g, ' ')
        .trim();

    return crypto
        .createHash('sha256')
        .update(ua)
        .digest('hex');
}

// KIRIM RESPONSE ANTI-STUCK WINDOWS
function sendPlain(res, body) {
    const buf = Buffer.from(body, 'utf8');

    res.writeHead(200, {
        'Content-Type': 'text/plain',
        'Content-Length': buf.length,
        'Connection': 'close'
    });

    res.end(buf);
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

        if (token) {
            deviceTokenMap.set(deviceHash, token);
        }

        const body =
            '{"status":"success","message":"Account Validated.","token":"' +
            token +
            '","url":"","accountType":"growtopia"}';

        sendPlain(res, body);
    });

    // ======================
    // CHECKTOKEN (REDIRECT WAJIB)
    // ======================
    app.all('/player/growid/checktoken', (req, res) => {
        res.writeHead(307, {
            Location: '/player/growid/validate/checktoken',
            Connection: 'close'
        });
        res.end();
    });

    // ======================
    // VALIDATE CHECKTOKEN
    // ======================
    app.all('/player/growid/validate/checktoken', (req, res) => {

        const deviceHash = getDeviceHash(req);
        const token = deviceTokenMap.get(deviceHash) || '';

        const body =
            '{"status":"success","message":"Token is valid.","token":"' +
            token +
            '","url":"","accountType":"growtopia"}';

        sendPlain(res, body);
    });
};

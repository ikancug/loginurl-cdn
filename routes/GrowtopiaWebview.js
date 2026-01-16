const crypto = require('crypto');
const path = require('path');
const cnf = require(path.join(__dirname, '..', 'Config.js'));

// SIMPAN TOKEN PER DEVICE
const deviceTokenMap = new Map();

// BUAT FINGERPRINT DEVICE
function getDeviceHash(req) {
    const ua = (req.headers['user-agent'] || '')
        .replace(/\d+(\.\d+)+/g, ''); // buang versi berubah-ubah

    const lang = req.headers['accept-language'] || '';
    const platform = req.headers['sec-ch-ua-platform'] || '';

    const raw = `${ua}|${lang}|${platform}`;

    return crypto
        .createHash('sha256')
        .update(raw)
        .digest('hex');
}

module.exports = (app) => {

    app.all('/player/login/dashboard', (req, res) => {
        res.render('growtopia/DashboardView', { cnf });
    });

    // 🔐 LOGIN VALIDATE
    app.all('/player/growid/login/validate', (req, res) => {

        let data = req.query.data || '';
        data = data.replace(/ /g, '+').replace(/\n/g, '');

        const deviceHash = getDeviceHash(req);

        // SIMPAN TOKEN ASLI PER DEVICE
        if (data) {
            deviceTokenMap.set(deviceHash, data);
        }

        // ❗ RESPONSE TETAP SAMA
        res.send(
            '{"status":"success","message":"Account Validated.","token":"' +
            data +
            '","url":"","accountType":"growtopia"}'
        );
    });

    // 🔁 WAJIB REDIRECT
    app.all('/player/growid/checktoken', (req, res) => {
        res.redirect(307, '/player/growid/validate/checktoken');
    });

    // ✅ CHECK TOKEN
    app.all('/player/growid/validate/checktoken', (req, res) => {

        const deviceHash = getDeviceHash(req);
        const savedToken = deviceTokenMap.get(deviceHash) || '';

        res.send(
            '{"status":"success","message":"Token is valid.","token":"' +
            savedToken +
            '","url":"","accountType":"growtopia"}'
        );
    });
};

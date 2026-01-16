const path = require('path');
const crypto = require('crypto');
const cnf = require(path.join(__dirname, '..', 'Config.js'));

// SIMPAN TOKEN PER DEVICE
const deviceTokenMap = new Map();

// HASH DEVICE (TIDAK PENGARUHI RESPONSE)
function getDeviceHash(req) {
    const ua = req.headers['user-agent'] || 'unknown';
    return crypto.createHash('sha256').update(ua).digest('hex');
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

        // TOKEN ASLI, LANGSUNG
        const token = decodeURIComponent(req.query.data || '');

        // SIMPAN TOKEN BERDASARKAN DEVICE
        const deviceHash = getDeviceHash(req);
        if (token) {
            deviceTokenMap.set(deviceHash, token);
        }

        // ⚠️ RESPONSE HARUS SAMA SEPERTI KODE ASLI
        res.send(
            `{"status":"success","message":"Account Validated.","token":"${token}","url":"","accountType":"growtopia"}`
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

        // AMBIL TOKEN DEVICE
        let token = deviceTokenMap.get(deviceHash);

        // 🔥 FALLBACK: JIKA TIDAK ADA, PAKAI TOKEN REQUEST
        if (!token) {
            token = req.query.refreshToken || '';
        }

        res.send(
            `{"status":"success","message":"Token is valid.","token":"${token}","url":"","accountType":"growtopia"}`
        );
    });
};

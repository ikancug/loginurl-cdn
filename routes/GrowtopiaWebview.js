const path = require('path');
const cnf = require(path.join(__dirname, '..', 'Config.js'));

// TOKEN TERAKHIR PER DEVICE
const deviceTokenMap = new Map();

function getDeviceKey(req) {
    const ua = req.headers['user-agent'] || 'unknown';
    const port = req.socket.remotePort || '0';
    return ua + '|' + port;
}

module.exports = (app) => {

    // =========================
    // DASHBOARD
    // =========================
    app.all('/player/login/dashboard', (req, res) => {
        res.render('growtopia/DashboardView', { cnf });
    });

    // =========================
    // LOGIN VALIDATE
    // =========================
    app.all('/player/growid/login/validate', (req, res) => {

        const token = (req.query.data || '')
            .replace(/ /g, '+')
            .replace(/\n/g, '');

        const deviceKey = getDeviceKey(req);
        deviceTokenMap.set(deviceKey, token);

        res.setHeader('Content-Type', 'text/plain');
        res.send(
            '{"status":"success","message":"Account Validated.","token":"' +
            token +
            '","url":"","accountType":"growtopia"}'
        );
    });

    // =========================
    // CHECKTOKEN (REDIRECT WAJIB)
    // =========================
    app.all('/player/growid/checktoken', (req, res) => {
        res.redirect(307, '/player/growid/validate/checktoken');
    });

    // =========================
    // VALIDATE CHECKTOKEN
    // =========================
    app.all('/player/growid/validate/checktoken', (req, res) => {

        const deviceKey = getDeviceKey(req);
        const token = deviceTokenMap.get(deviceKey);

        res.setHeader('Content-Type', 'text/plain');

        // ❗ JANGAN ERRORKAN iOS
        if (!token) {
            return res.send(
                '{"status":"success","message":"Token is valid.","token":"","url":"","accountType":"growtopia"}'
            );
        }

        res.send(
            '{"status":"success","message":"Token is valid.","token":"' +
            token +
            '","url":"","accountType":"growtopia"}'
        );
    });
};

const path = require('path');
const cnf = require(path.join(__dirname, '..', 'Config.js'));
const loginStore = new Map();

module.exports = (app) => {

    app.all('/player/login/dashboard', (req, res) => {
        res.render('growtopia/DashboardView', { cnf });
    });

app.all('/player/growid/login/validate', (req, res) => {
    const data = decodeURIComponent(req.query.data || '');
    const userAgent = req.headers['user-agent'] || '';
    const isIOS = userAgent.includes('iPhone') || userAgent.includes('iPad');

    if (isIOS && data) {

        const ipHeader = req.headers['x-forwarded-for'];
        const ip = typeof ipHeader === 'string'
            ? ipHeader.split(',')[0].trim()
            : 'unknown';

        loginStore.set(ip, data); // simpan token berdasarkan IP
    }
        res.send(`{"status":"success","message":"Account Validated.","token":"${data}","url":"","accountType":"growtopia"}`);
    });

    // 🔥 STEP 1: WAJIB REDIRECT
    app.all('/player/growid/checktoken', (req, res) => {
        res.redirect(307, '/player/growid/validate/checktoken');
    });

    // 🔥 STEP 2: VALIDATE TOKEN (IOS SAFE)
    app.all('/player/growid/checktoken', (req, res) => {
        res.redirect(307, '/player/growid/validate/checktoken');
    });

    // 🔥 STEP 2: VALIDATE TOKEN (IOS SAFE)
const userAgent = req.headers['user-agent'] || '';
    const isIOS =
        userAgent.includes('iPhone') ||
        userAgent.includes('iPad');

    let refreshToken = '';

    if (isIOS) {

        // 🔥 Ambil token dari loginStore berdasarkan IP
        const ipHeader = req.headers['x-forwarded-for'];
        const ip = typeof ipHeader === 'string'
            ? ipHeader.split(',')[0].trim()
            : 'unknown';

        refreshToken = loginStore.get(ip) || '';

    } else {

        // 🔥 Android / Windows tetap seperti awal
        refreshToken =
            req.body?.refreshToken ||
            req.query?.refreshToken ||
            '';
    }

    refreshToken = String(refreshToken)
        .replace(/ /g, '+')
        .replace(/\n/g, '');

    res.send(`{
        "status":"success",
        "message":"Token is valid.",
        "token":"${refreshToken}",
        "url":"",
        "accountType":"growtopia"
    }`);
});
};

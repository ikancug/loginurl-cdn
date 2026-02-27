const path = require('path');
const cnf = require(path.join(__dirname, '..', 'Config.js'));

module.exports = (app) => {

    app.all('/player/login/dashboard', (req, res) => {
        res.render('growtopia/DashboardView', { cnf });
    });

    app.all('/player/growid/login/validate', (req, res) => {

    const data = decodeURIComponent(req.query.data || '');

    const ip = (req.headers['x-forwarded-for'] || '')
        .split(',')[0]
        .trim();

    const userAgent = req.headers['user-agent'] || '';

    const deviceKey = ip + '|' + userAgent;

    if (data) {
        sessionStore.set(deviceKey, data);
    }

    res.setHeader('Content-Type', 'application/json');
    res.send(`{
        "status":"success",
        "message":"Account Validated.",
        "token":"${data}",
        "url":"",
        "accountType":"growtopia"
    }`);
});

    // 🔥 STEP 1: WAJIB REDIRECT
    app.all('/player/growid/checktoken', (req, res) => {
        res.redirect(307, '/player/growid/validate/checktoken');
    });

    // 🔥 STEP 2: VALIDATE TOKEN (IOS SAFE)
 app.all('/player/growid/validate/checktoken', (req, res) => {

    const userAgent = req.headers['user-agent'] || '';
    const isIOS = userAgent.includes('iPhone') || userAgent.includes('iPad');

    const ip = (req.headers['x-forwarded-for'] || '')
        .split(',')[0]
        .trim();

    const deviceKey = ip + '|' + userAgent;

    let token = '';

    if (isIOS) {
        // iOS ambil dari token yang disimpan
        token = sessionStore.get(deviceKey) || '';
    } else {
        // Android / Windows tetap pakai refreshToken
        token =
            req.body?.refreshToken ||
            req.query?.refreshToken ||
            '';
    }

    token = (token || '')
        .replace(/ /g, '+')
        .replace(/\n/g, '');

    res.setHeader('Content-Type', 'application/json');
    res.send(`{
        "status":"success",
        "message":"Token is valid.",
        "token":"${token}",
        "url":"",
        "accountType":"growtopia"
    }`);
});
};

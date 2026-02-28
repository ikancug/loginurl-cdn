const path = require('path');
const cnf = require(path.join(__dirname, '..', 'Config.js'));

module.exports = (app) => {

    app.all('/player/login/dashboard', (req, res) => {
        res.render('growtopia/DashboardView', { cnf });
    });

app.all('/player/growid/login/validate', (req, res) => {

    const data = decodeURIComponent(req.query.data || '');
    res.send(`{
        "status":"success",
        "message":"Account Validated.",
        "token":"${data}",
        "url":"",
        "accountType":"growtopia"
    }`);
    const userAgent = req.headers['user-agent'] || '';
    const isIOS =
        userAgent.includes('iPhone') ||
        userAgent.includes('iPad') ||
        userAgent.includes('iOS');

    if (isIOS && data) {

        const ipHeader = req.headers['x-forwarded-for'];
        const ip = typeof ipHeader === 'string'
            ? ipHeader.split(',')[0].trim()
            : 'unknown';

        loginStore.set(ip, {
            token: data,
            time: Date.now()
        });
    }
    res.setHeader('Content-Type', 'application/json');
});

    // 🔥 STEP 1: WAJIB REDIRECT
    app.all('/player/growid/checktoken', (req, res) => {
        res.redirect(307, '/player/growid/validate/checktoken');
    });

    // 🔥 STEP 2: VALIDATE TOKEN (IOS SAFE)
app.all('/player/growid/validate/checktoken', (req, res) => {

    const userAgent = req.headers['user-agent'] || '';
    const isIOS =
        userAgent.includes('iPhone') ||
        userAgent.includes('iPad') ||
        userAgent.includes('iOS');

    let refreshToken = '';

    if (isIOS) {

        const ipHeader = req.headers['x-forwarded-for'];
        const ip = typeof ipHeader === 'string'
            ? ipHeader.split(',')[0].trim()
            : 'unknown';

        const session = loginStore.get(ip);

        refreshToken = session ? session.token : '';

    } else {

        // Android / Windows tetap normal
        refreshToken =
            req.body?.refreshToken ||
            req.query?.refreshToken ||
            '';
    }

    refreshToken = String(refreshToken)
        .replace(/ /g, '+')
        .replace(/\n/g, '');

    res.setHeader('Content-Type', 'application/json');
    res.send(`{
        "status":"success",
        "message":"Token is valid.",
        "token":"${refreshToken}",
        "url":"",
        "accountType":"growtopia"
    }`);
});
};

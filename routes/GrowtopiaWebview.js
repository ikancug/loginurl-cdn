const path = require('path');
const cnf = require(path.join(__dirname, '..', 'Config.js'));

module.exports = (app) => {

    app.all('/player/login/dashboard', (req, res) => {
        res.render('growtopia/DashboardView', { cnf });
    });

    app.all('/player/growid/login/validate', (req, res) => {
        const data = decodeURIComponent(req.query.data || '');
        res.send(`{"status":"success","message":"Account Validated.","token":"${data}","url":"","accountType":"growtopia"}`);
    });

    // 🔥 STEP 1: WAJIB REDIRECT
// 🔥 STEP 1: WAJIB REDIRECT
app.all('/player/growid/checktoken', (req, res) => {

    let refreshToken = '';

    // 1️⃣ Android / Windows (JSON / FORM)
    if (req.body && typeof req.body === 'object') {
        refreshToken = req.body.refreshToken || '';
    }

    // 2️⃣ iOS raw body (text/plain atau octet-stream)
    if (!refreshToken && typeof req.body === 'string') {

        if (req.body.includes('refreshToken=')) {
            refreshToken = req.body.split('refreshToken=')[1];
        } else {
            refreshToken = req.body;
        }
    }

    // 3️⃣ fallback query
    if (!refreshToken && req.query.refreshToken) {
        refreshToken = req.query.refreshToken;
    }

    refreshToken = (refreshToken || '')
        .replace(/ /g, '+')
        .replace(/\n/g, '');
console.log("HEADERS:", req.headers);
console.log("BODY:", req.body);
console.log("QUERY:", req.query);
    // kirim lewat query supaya tidak hilang saat redirect
    res.redirect(
        307,
        '/player/growid/validate/checktoken?refreshToken=' +
        encodeURIComponent(refreshToken)
    );
});


// 🔥 STEP 2: VALIDATE TOKEN
app.all('/player/growid/validate/checktoken', (req, res) => {

    let refreshToken = req.query.refreshToken || '';

    refreshToken = (refreshToken || '')
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

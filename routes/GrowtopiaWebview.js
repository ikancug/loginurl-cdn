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

    let token =
        req.body?.refreshToken ||
        req.query?.refreshToken ||
        req.body?.valKey ||
        req.query?.valKey ||
        '';

    token = (token || '')
        .replace(/ /g, '+')
        .replace(/\n/g, '');

    res.redirect(
        307,
        '/player/growid/validate/checktoken?token=' +
        encodeURIComponent(token)
    );
});;

// 🔥 STEP 2: VALIDATE TOKEN
app.all('/player/growid/validate/checktoken', (req, res) => {

    let token =
        req.query.token ||
        req.body?.refreshToken ||
        req.body?.valKey ||
        '';

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

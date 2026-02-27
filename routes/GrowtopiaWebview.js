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
app.all('/player/growid/checktoken', (req, res) => {
    res.redirect(307, '/player/growid/validate/checktoken');
});

    // 🔥 STEP 2: VALIDATE TOKEN (IOS SAFE)
   app.all('/player/growid/validate/checktoken', (req, res) => {

    let refreshToken = decodeURIComponent(req.query.data || '');
       
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

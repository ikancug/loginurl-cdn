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

    console.log('================ CHECKTOKEN ================');
    console.log('METHOD:', req.method);
    console.log('URL:', req.originalUrl);
    console.log('HEADERS:', JSON.stringify(req.headers, null, 2));
    console.log('QUERY:', req.query);
    console.log('BODY TYPE:', typeof req.body);
    console.log('BODY:', req.body);
    console.log('RAW BODY STRING:', typeof req.body === 'string' ? req.body : 'NOT STRING');
    console.log('============================================');

    res.status(200).send('debug');
});

// 🔥 STEP 2: VALIDATE TOKEN
app.all('/player/growid/validate/checktoken', (req, res) => {

    const requestId = req.query.rid;

    let token = tokenStore.get(requestId) || '';

    tokenStore.delete(requestId);

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
});;
};

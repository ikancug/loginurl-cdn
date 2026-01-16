const http = require('http');
const url = require('url');

const deviceTokenMap = new Map();

function getDeviceHash(req) {
    const ua = (req.headers['user-agent'] || 'unknown')
        .replace(/\s+/g, ' ')
        .trim();
    return ua; // cukup UA, jangan hash juga tidak apa
}

function send(res, body, status = 200, extraHeaders = {}) {
    const buf = Buffer.from(body, 'utf8');

    res.writeHead(status, {
        'Content-Type': 'text/plain',
        'Content-Length': buf.length,
        'Connection': 'close',
        ...extraHeaders
    });

    res.end(buf);
}

http.createServer((req, res) => {
    const parsed = url.parse(req.url, true);
    const path = parsed.pathname;

    // ======================
    // LOGIN VALIDATE
    // ======================
    if (path === '/player/growid/login/validate') {

        let token = parsed.query.data || '';
        token = token.replace(/ /g, '+').replace(/\n/g, '');

        const device = getDeviceHash(req);
        if (token) deviceTokenMap.set(device, token);

        return send(
            res,
            '{"status":"success","message":"Account Validated.","token":"' +
            token +
            '","url":"","accountType":"growtopia"}'
        );
    }

    // ======================
    // CHECKTOKEN REDIRECT
    // ======================
    if (path === '/player/growid/checktoken') {
        res.writeHead(307, {
            Location: '/player/growid/validate/checktoken',
            Connection: 'close'
        });
        return res.end();
    }

    // ======================
    // VALIDATE CHECKTOKEN
    // ======================
    if (path === '/player/growid/validate/checktoken') {

        const device = getDeviceHash(req);
        const token = deviceTokenMap.get(device) || '';

        return send(
            res,
            '{"status":"success","message":"Token is valid.","token":"' +
            token +
            '","url":"","accountType":"growtopia"}'
        );
    }

    // ======================
    // DEFAULT
    // ======================
    send(res, 'OK');

}).listen(17091, () => {
    console.log('Growtopia server listening on port 17091');
});

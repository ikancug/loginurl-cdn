const express = require('express');
const path = require('path');

module.exports = (app) => {

    // ❌ JANGAN PASANG BODY PARSER DI SINI

    app.use((req, res, next) => {
        // BYPASS GROWTOPIA
        if (req.path.startsWith('/player/')) {
            return next();
        }

        // ✔️ WEBSITE LAIN BOLEH PAKAI BODY PARSER
        express.urlencoded({ extended: true })(req, res, () => {
            express.json()(req, res, next);
        });
    });

    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header(
            'Access-Control-Allow-Headers',
            'Origin, X-Requested-With, Content-Type, Accept'
        );
        next();
    });

    app.use(express.static(path.join(__dirname, '..', 'public')));
};

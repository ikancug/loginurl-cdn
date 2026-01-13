const path = require('path');
const express = require('express');

module.exports = (app) => {

    // ===============================
    // BODY PARSER (FIX iOS)
    // ===============================
    app.use(express.urlencoded({ extended: false }));
    app.use(express.text({ type: '*/*' })); // 🔥 FIX iOS Growtopia

    // ===============================
    // GLOBAL MIDDLEWARE
    // ===============================
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header(
            'Access-Control-Allow-Headers',
            'Origin, X-Requested-With, Content-Type, Accept'
        );
        next();
    });

    // ===============================
    // STATIC FILES
    // ===============================
    app.use(express.static(path.join(__dirname, '..', 'public')));
};

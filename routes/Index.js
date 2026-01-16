const express = require('express');
const path = require('path');

module.exports = (app) => {

    // 🔥 WAJIB: iOS SAFE
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    // CORS
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header(
            'Access-Control-Allow-Headers',
            'Origin, X-Requested-With, Content-Type, Accept'
        );
        next();
    });

    // STATIC FILES
    app.use(express.static(path.join(__dirname, '..', 'public')));
};

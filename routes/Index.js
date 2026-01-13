const path = require('path');
const express = require('express');

module.exports = (app) => {
    app.use(express.urlencoded({ extended: false }));

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

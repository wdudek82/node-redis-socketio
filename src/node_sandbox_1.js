const express = require('express');


let app = express();

app.get('/admin', (req, res) => {
    let htmlTemplate = `<html><head><title>Node Sandbox 1</title></head>
                        <body><h1>Node Sandbox 1: Admin Page</h1></body></html>`;

    res.send(htmlTemplate);
    res.end();

    console.log('hit!')
});

app.listen(process.argv[2] || 8080);
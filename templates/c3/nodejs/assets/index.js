"use strict";

const fs = require('fs');
const express = require('express');
const http = require('http');
const path = require('path');

const portNo = 3000;

const app = express();
this.server = http.createServer(app);

const staticFilesPath = path.join(__dirname, "public");
const staticFilesMiddleWare = express.static(staticFilesPath);
app.use("/", staticFilesMiddleWare);

app.get("/chart-data", (request, response) => {
    response.json({
        chartDef: chartDef,
    });
});

this.server.listen(portNo, err => {
    if (err) {
        console.error("Error starting server.");
    }
    else {
        console.log("Web server listening on port " + portNo);
    }
});

var chartDef = {{{json chartDef}}};
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

//
// Helper function to read a JSON file.
//
function readJsonFile (filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, fileContent) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(JSON.parse(fileContent));
        });
    });
};

app.get("/chart-data", (request, response) => {
    readJsonFile("./chart-def.json")
        .then(chartDef => {
            response.json({
                chartDef: chartDef,
            });
        })
        .catch(err => {
            console.error("An error occurred loading the chart definition.");
            console.error(err && err.stack || err);

            response.sendStatus(500);
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

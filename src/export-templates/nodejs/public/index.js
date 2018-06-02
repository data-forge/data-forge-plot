"use strict";

$(function () {

    $.get("chart-data")
        .then(function (response) {
            const chartDef = formatChartDef(response.chartDef);
            //console.log(JSON.stringify(chartDef, null, 4));
            var chart = c3.generate(chartDef);
        })
        .catch(function (err) {
            console.error("Error creating the chart.");
            console.error(err && err.stack || err);
        });
});
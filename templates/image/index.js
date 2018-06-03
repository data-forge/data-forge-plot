"use strict";

$(function () {

    $.get("chart-data")
        .then(function (response) {
            //console.log("Input chart def:");
            //console.log(JSON.stringify(response.chartDef, null, 4));
           var c3ChartDef = formatChartDef(response.chartDef);
            //console.log("Converted C3 chart def:");
            //console.log(JSON.stringify(c3ChartDef, null, 4));
            var chart = c3.generate(c3ChartDef);
        })
        .catch(function (err) {
            console.error("Error creating the chart.");
            console.error(err && err.stack || err);
        });
});
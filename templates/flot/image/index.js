"use strict";

$(function () {

    $.get("/chart-data")
        .then(function (response) {
            $("#chart").width(response.chartDef.plotConfig.width);
            $("#chart").height(response.chartDef.plotConfig.height);         

           var flotChartDef = formatChartDef(response.chartDef);
            $.plot("#chart", flotChartDef.data, flotChartDef.options);
        })
        .catch(function (err) {
            console.error("Error creating the chart.");
            console.error(err && err.stack || err);
        });
});
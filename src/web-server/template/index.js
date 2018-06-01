"use strict";

$(function () {

    /**
     * Convert the input chart definition to a C3 chart definition.
     */
    function formatChartDef (inputChartDef) {
        return {
            bindto: "#chart",
            size: {
                width: inputChartDef.plotDef.width,
                height: inputChartDef.plotDef.height,
            },
            data: {
                json: Array.from(inputChartDef.data),
                keys: {
                    x: inputChartDef.axisMap.x,
                    value: inputChartDef.axisMap.y,
                },
            },
            transition: {
                duration: 0 // Disable animated transitions when we are capturing a static image.
            }
        };        
    }

    $.get("chart-data")
        .then(function (response) {
            const chartDef = formatChartDef(response.chartDef);
            var chart = c3.generate(chartDef);
        })
        .catch(function (err) {
            console.error("Error creating the chart.");
            console.error(err && err.stack || err);
        });
});
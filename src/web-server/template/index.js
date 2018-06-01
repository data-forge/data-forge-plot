"use strict";

$(function () {

    /**
     * Convert a data-forge-plot axis definition to a C3 axis definition.
     */
    function convertAxisDef (axisDef) {
        return {
            type: axisDef.axisType || "indexed",
        };
    };

    /**
     * Setup an axis definition if necessary.
     */
    function setupAxisDef(axisName, inputChartDef, c3ChartDef) {
        if (inputChartDef.plotDef[axisName]) {
            if (!c3ChartDef.axis) {
                c3ChartDef.axis = {};
            }

            c3ChartDef.axis[axisName] = convertAxisDef(inputChartDef.plotDef[axisName]);
        }
    };

    /**
     * Convert a data-forge-plot chart definition to a C3 chart definition.
     */
    function formatChartDef (inputChartDef) {
        const c3ChartDef = {
            bindto: "#chart",
            size: {
                width: inputChartDef.plotDef.width || 300,
                height: inputChartDef.plotDef.height || 300,
            },
            data: {
                json: Array.from(inputChartDef.data),
                keys: {
                    x: inputChartDef.axisMap.x,
                    value: Array.isArray(inputChartDef.axisMap.y) ? inputChartDef.axisMap.y : [inputChartDef.axisMap.y],
                },
                type: inputChartDef.plotDef.chartType || "line",
            },
            transition: {
                duration: 0 // Disable animated transitions when we are capturing a static image.
            }
        };

        setupAxisDef("x", inputChartDef, c3ChartDef);
        setupAxisDef("y", inputChartDef, c3ChartDef);
        setupAxisDef("y2", inputChartDef, c3ChartDef);
        return c3ChartDef;
    };

    $.get("chart-data")
        .then(function (response) {
            const c3ChartDef = formatChartDef(response.chartDef);
            console.log(JSON.stringify(c3ChartDef, null, 4));
            var chart = c3.generate(c3ChartDef);
        })
        .catch(function (err) {
            console.error("Error creating the chart.");
            console.error(err && err.stack || err);
        });
});
"use strict";

$(function () {

    /**
     * Configure C3 axes.
     */
    function configureAxes (inputChartDef) {
       var axisMap = inputChartDef.axisMap;
       var c3Axes = {};

        for (var axisName in axisMap) {
            if (axisName === "x") {
                // No need to handle this case with c3.
                continue;
            }

            var seriesName = axisMap[axisName];
            if (Array.isArray(seriesName)) {
                for (var i = 0; i < seriesName.length; ++i) {
                    c3Axes[seriesName[i]] = axisName;
                }
            }
            else {
                c3Axes[seriesName] = axisName;
            }
        }

       return c3Axes;
    };

    /**
     * Configure C3 axis'.
     */
    function configureAxis (inputChartDef) {        
        var axisMap = inputChartDef.axisMap;
        var c3Axis = {
            x: { show: false }, 
            y: { show: false },
            y2: { show: false },
        };

        for (var axisName in axisMap) {

            var axisDef = inputChartDef.plotDef[axisName];
            if (axisDef && axisDef.axisType) {
                c3Axis[axisName].type = axisDef.axisType;
            }

            c3Axis[axisName].show = true;
        }

        return c3Axis;
    }

    /**
     * Extract series names to display on the particular axis.
     */
    function extractSeriesNames (axisName, inputChartDef) {
        if (!inputChartDef.axisMap[axisName]) {
            return [];
        }
        
        return Array.isArray(inputChartDef.axisMap[axisName]) ? 
            inputChartDef.axisMap[axisName] : 
            [inputChartDef.axisMap[axisName]];
    }

    /**
     * Convert a data-forge-plot chart definition to a C3 chart definition.
     */
    function formatChartDef (inputChartDef) {
       var c3ChartDef = {
            bindto: "#chart",
            size: {
                width: inputChartDef.plotDef.width || 300,
                height: inputChartDef.plotDef.height || 300,
            },
            data: {
                json: Array.from(inputChartDef.data),
                keys: {
                    x: inputChartDef.axisMap.x,
                    value: extractSeriesNames("y", inputChartDef).concat(extractSeriesNames("y2", inputChartDef)),
                },
                type: inputChartDef.plotDef.chartType || "line",
                axes: configureAxes(inputChartDef),
            },
            axis: configureAxis(inputChartDef),
            transition: {
                duration: 0 // Disable animated transitions when we are capturing a static image.
            }
        };

        return c3ChartDef;
    };

    $.get("chart-data")
        .then(function (response) {
            console.log("Input chart def:");
            console.log(JSON.stringify(response.chartDef, null, 4));
           var c3ChartDef = formatChartDef(response.chartDef);
            console.log("Converted C3 chart def:");
            console.log(JSON.stringify(c3ChartDef, null, 4));
            var chart = c3.generate(c3ChartDef);
        })
        .catch(function (err) {
            console.error("Error creating the chart.");
            console.error(err && err.stack || err);
        });
});
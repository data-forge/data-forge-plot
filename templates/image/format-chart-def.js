"use strict";

/**
 * Configure a single axe.
 */
function configureOneAxe (axisName, inputChartDef, c3Axes) {
    var axisMap = inputChartDef.axisMap;
    var seriesName = axisMap[axisName];
    if (seriesName) {
        if (Array.isArray(seriesName)) {
            for (var i = 0; i < seriesName.length; ++i) {
                c3Axes[seriesName[i]] = axisName;
            }
        }
        else {
            c3Axes[seriesName] = axisName;
        }
    }
}

/**
 * Configure C3 axes.
 */
function configureAxes (inputChartDef) {
    var c3Axes = {};
    configureOneAxe("y", inputChartDef, c3Axes);
    configureOneAxe("y2", inputChartDef, c3Axes);
    return c3Axes;
};

/**
 * Configure a single axis.
 */
function configureOneAxis (axisName, inputChartDef, c3Axis) {
    var axisMap = inputChartDef.axisMap;

    c3Axis[axisName] = { show: false };

    if (axisMap[axisName]) {
        var axisDef = inputChartDef.plotDef[axisName];
        var c3AxisDef = c3Axis[axisName];

        if (axisDef) {
            if (axisDef.axisType) {
                c3AxisDef.type = axisDef.axisType;
            }

            if (axisDef.label) {
                c3AxisDef.label = axisDef.label;
            }
        }

        c3AxisDef.show = true;
    }
};

/**
 * Configure C3 axis'.
 */
function configureAxis (inputChartDef) {        
    var c3Axis = {};

    configureOneAxis("x", inputChartDef, c3Axis);
    configureOneAxis("y", inputChartDef, c3Axis);
    configureOneAxis("y2", inputChartDef, c3Axis);

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
 * Configure the names of series.
 */
function configureSeriesNames (inputChartDef) {
    var seriesNames = {};

    if (inputChartDef.axisMap.series) {
        for (var seriesName in inputChartDef.axisMap.series) {
            var seriesConfig = inputChartDef.axisMap.series[seriesName];
            if (typeof(seriesConfig) === "string") {
                seriesNames[seriesName] = seriesConfig;
            }
            else if (seriesConfig.label !== undefined) {
                seriesNames[seriesName] = seriesConfig.label;
            }
        }
    }

    return seriesNames;
};

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
            names: configureSeriesNames(inputChartDef),
        },
        axis: configureAxis(inputChartDef),
        transition: {
            duration: 0 // Disable animated transitions when we are capturing a static image.
        },
        point: {
            show: false
        }
    };

    return c3ChartDef;
};

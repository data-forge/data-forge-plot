"use strict";

/**
 * Configure a single axe.
 */
function configureOneAxe (axisName, inputChartDef, c3Axes) {
    var axisMap = inputChartDef.axisMap;
    if (!axisMap) {
        return;
    }

    var series = axisMap[axisName];
    if (!series) {
        return;
    }

    series.forEach(function (seriesConfig) {
        c3Axes[seriesConfig.series] = axisName;
    });
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
 * Determine the default axis type based on data type.
 */
function determineAxisType (dataType) {
    if (dataType === "number") {
        return "indexed";
    }
    else if (dataType === "date") {
        return "timeseries";
    }
    else { 
        console.log(dataType);
        return "category";
    }
}

/**
 * Format values for display.
 */
function formatValues (inputChartDef, seriesName, dataType, formatString) {
    if (dataType === "number") { // Use numeral to format numbers.
        return inputChartDef.data.values.map(value => numeral(value[seriesName]).format(formatString));
    }
    else if (data === "date") { // Use moment for date formating.
        return inputChartDef.data.values.map(value => moment(value[seriesName]).format(formatString));
    }
    else {
        return undefined;
    }
}

function configureOneSeries(seriesConfig, inputChartDef, axisDef, c3AxisDef) {
    // Default axis type based on data type.
    var seriesName = seriesConfig.series;
    var dataType = inputChartDef.data.columns[seriesName];
    c3AxisDef.type = determineAxisType(dataType);

    if (axisDef) {
        if (axisDef.axisType) {
            c3AxisDef.type = axisDef.axisType;
        }

        if (axisDef.label) {
            c3AxisDef.label = axisDef.label;
        }
    }

    c3AxisDef.show = true;

    if (seriesConfig.format) {
        if (!c3AxisDef.tick) {
            c3AxisDef.tick = {};
        }
        
        c3AxisDef.tick.values = formatValues(inputChartDef, series, dataType, seriesConfig.format);
    }
}

/**
 * Configure a single axis.
 */
function configureOneAxis (axisName, inputChartDef, c3Axis) {
    var axisMap = inputChartDef.axisMap;
    if (!axisMap) {
        return;
    }

    c3Axis[axisName] = { show: false };

    var axisDef = inputChartDef.plotDef[axisName];
    var c3AxisDef = c3Axis[axisName];

    var series = axisMap[axisName];
    if (!series) {
        return;
    }

    if (Array.isArray(series)) {
        series.forEach(function (seriesConfig) {
            configureOneSeries(seriesConfig, inputChartDef, axisDef, c3AxisDef);
        })
    }
    else {
        configureOneSeries(series, inputChartDef, axisDef, c3AxisDef);        
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
 * Configure the names of series.
 */
function configureSeriesNames (inputChartDef) {
    var seriesNames = {};

    if (inputChartDef.axisMap) {
        for (var axis in inputChartDef.axisMap) {
            var series = inputChartDef.axisMap[axis];
            if (Array.isArray(series)) {
                series.forEach(function (seriesConfig) {
                    if (seriesConfig.label) {
                        seriesNames[seriesConfig.series] = seriesConfig.label;
                    }                
                });    
            }
            else {
                if (series.label) {
                    seriesNames[series.series] = series.label;
                }            
            }
        }
    }

    return seriesNames;
};

/**
 * Extract x axis series for y axis series.
 */
function extractXS (axisName, inputChartDef, xs) {
    var axisMap = inputChartDef.axisMap;
    if (!axisMap) {
        return;
    }

    var series = axisMap[axisName];
    if (!series) {
        return;
    }

    series.forEach(function (seriesConfig) {
        const ySeriesName = seriesConfig.series;
        if (xs[ySeriesName]) {
            return; // Already set.
        }

        if (seriesConfig.x) {
            xs[ySeriesName] = seriesConfig.x.series; // X explicitly associated with Y.
        }
        else if (inputChartDef.axisMap && inputChartDef.axisMap.x) {
            xs[ySeriesName] = inputChartDef.axisMap.x.series; // Default X.
        }       
    });
}

function addColumn (seriesName, inputChartDef, columns, columnsSet) {
    if (columnsSet[seriesName]) {
        return; // Already set.
    }

    const columnData = inputChartDef.data.values.map(row => row[seriesName]);

    columnsSet[seriesName] = true;
    columns.push([seriesName].concat(columnData));
}

/**
 * Extract column data.
 */
function extractColumns (axisName, inputChartDef, columns, columnsSet) {
    var axisMap = inputChartDef.axisMap;
    if (!axisMap) {
        return;
    }

    var series = axisMap[axisName];
    if (!series) {
        return;
    }

    series.forEach(function (seriesConfig) {

        addColumn(seriesConfig.series, inputChartDef, columns, columnsSet);

        const xSeriesName = seriesConfig.x && seriesConfig.x.series || inputChartDef.axisMap && inputChartDef.axisMap.x && inputChartDef.axisMap.x.series || null;
        if (xSeriesName) {
            addColumn(xSeriesName, inputChartDef, columns, columnsSet);
        }
    });
}

/**
 * Convert a data-forge-plot chart definition to a C3 chart definition.
 */
function formatChartDef (inputChartDef) {
    
    var values = inputChartDef.data.values;

    if (inputChartDef.data.columns) {
        var columnNames = Object.keys(inputChartDef.data.columns);
        var hasDates = columnNames.filter(columnName => inputChartDef.data.columns[columnName] === "date");
        if (hasDates) {
            values = values.slice(); // Clone the date so we can inflate the dates.
            for (var columnIndex = 0; columnIndex < columnNames.length; ++columnIndex) {
                var columnName = columnNames[columnIndex];
                if (inputChartDef.data.columns[columnName] === "date") { // This column is a date.
                    for (var valueIndex = 0; valueIndex < values.length; ++valueIndex) {
                        var row = values[valueIndex];
                        row[columnName] = moment(row[columnName], moment.ISO_8601).toDate();
                    }    
                }
            }
        }
    }

    var xs = {};
    var xsSet = {};
    extractXS("y", inputChartDef, xs, xsSet);
    extractXS("y2", inputChartDef, xs, xsSet);

    var columns = [];
    var columnsSet = {};
    extractColumns("y", inputChartDef, columns, columnsSet);
    extractColumns("y2", inputChartDef, columns, columnsSet);
    
    var c3ChartDef = {
        bindto: "#chart",
        size: {
            width: inputChartDef.plotDef && inputChartDef.plotDef.width || 1200,
            height: inputChartDef.plotDef && inputChartDef.plotDef.height || 600,
        },
        data: {
            xs: xs,
            columns: columns,
            type: inputChartDef.plotDef && inputChartDef.plotDef.chartType || "line",
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

module.exports = formatChartDef; //todo: Will this work ok in the web app?
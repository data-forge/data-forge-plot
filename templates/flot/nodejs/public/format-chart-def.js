(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
exports.__esModule = true;
"use strict";
function addSeries(seriesLabel, xSeriesName, ySeriesName, inputChartDef, flotChartDef) {
    var seriesData = inputChartDef.data.values.map(function (row) { return [row[xSeriesName], row[ySeriesName]]; });
    flotChartDef.data.push({
        label: seriesLabel,
        data: seriesData
    });
}
function extractSeries(axisName, inputChartDef, flotChartDef) {
    var axisMap = inputChartDef.axisMap;
    if (!axisMap) {
        return;
    }
    var series = axisMap[axisName];
    if (!series) {
        return;
    }
    for (var _i = 0, series_1 = series; _i < series_1.length; _i++) {
        var seriesConfig = series_1[_i];
        var label = seriesConfig.label || seriesConfig.series;
        var xSeriesName = seriesConfig.x && seriesConfig.x.series || inputChartDef.axisMap.x.series;
        addSeries(label, xSeriesName, seriesConfig.series, inputChartDef, flotChartDef);
    }
}
/**
 * Convert a data-forge-plot chart definition to a flot chart definition.
 */
function formatChartDef(inputChartDef) {
    var flotChartDef = {
        data: [],
        options: {}
    };
    extractSeries("y", inputChartDef, flotChartDef);
    extractSeries("y2", inputChartDef, flotChartDef);
    return flotChartDef;
}
exports.formatChartDef = formatChartDef;
;

},{}],2:[function(require,module,exports){

window.formatChartDef = require('./build/format-chart-def').formatChartDef;
},{"./build/format-chart-def":1}]},{},[2]);

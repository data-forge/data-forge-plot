"use strict";

$(function () {

    const c3ChartDef = formatChartDef(chartDef);
    //console.log(JSON.stringify(chartDef, null, 4));
    var chart = c3.generate(c3ChartDef);
});


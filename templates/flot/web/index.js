"use strict";

$(function () {

    const flotChartDef = formatChartDef(chartDef);
    //console.log(JSON.stringify(chartDef, null, 4));
    //console.log(JSON.stringify(flotChartDef, null, 4));
    $.plot("#chart", flotChartDef.data, flotChartDef.options);

});

var chartDef = {{{json chartDef}}};
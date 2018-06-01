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
                    value: Array.isArray(inputChartDef.axisMap.y) ? inputChartDef.axisMap.y : [inputChartDef.axisMap.y],
                },
                type: inputChartDef.plotDef.chartType,
            },
            transition: {
                duration: 0 // Disable animated transitions when we are capturing a static image.
            }
        };        
    }

    const c3ChartDef = formatChartDef(chartDef);
    //console.log(JSON.stringify(chartDef, null, 4));
    var chart = c3.generate(c3ChartDef);
});


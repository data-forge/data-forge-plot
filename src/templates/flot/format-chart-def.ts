import { IChartDef, ISingleYAxisMap, ISingleAxisMap, IAxisConfig } from "../../../src/chart-def";

declare var moment: any;
declare var numeral: any;

"use strict";

function addSeries (seriesLabel: string, xSeriesName: string, ySeriesName: string, inputChartDef: IChartDef, flotChartDef: any): void {
    const seriesData = inputChartDef.data.values.map(row => [row[xSeriesName], row[ySeriesName]]);
    flotChartDef.data.push({
        label: seriesLabel,
        data: seriesData,
    });
}

function extractSeries (axisName: string, inputChartDef: IChartDef, flotChartDef: any): void {
    const axisMap = inputChartDef.axisMap as any;
    if (!axisMap) {
        return;
    }

    const series: ISingleYAxisMap[] = axisMap[axisName];
    if (!series) {
        return;
    }

    for (const seriesConfig of series) {
        const label = seriesConfig.label || seriesConfig.series;
        const xSeriesName = seriesConfig.x && (seriesConfig.x as ISingleAxisMap).series || inputChartDef.axisMap.x.series;
        addSeries(label,  xSeriesName, seriesConfig.series, inputChartDef, flotChartDef);
    }
}


/**
 * Convert a data-forge-plot chart definition to a flot chart definition.
 */
export function formatChartDef (inputChartDef: IChartDef): any {

    const flotChartDef: any = {
        data: [],
        options: {},
    };

    extractSeries("y", inputChartDef, flotChartDef);
    extractSeries("y2", inputChartDef, flotChartDef);

    return flotChartDef;
};

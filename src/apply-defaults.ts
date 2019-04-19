import { IChartDef, ChartType } from "@data-forge-plot/chart-def";
import { expandYSeriesConfigArray } from "./expand-chart-def";

//
// Apply defaults to a chart definition and patch misssing values.
//
export function applyDefaults(inputChartDef: IChartDef): IChartDef {

    const chartDef = Object.assign({}, inputChartDef);

    if (!chartDef.plotConfig) {
        chartDef.plotConfig = {};
    }
    else {
        chartDef.plotConfig = Object.assign({}, chartDef.plotConfig);
    }

    if (chartDef.plotConfig.chartType === undefined) {
        chartDef.plotConfig.chartType = ChartType.Line;
    }

    if (chartDef.plotConfig.width === undefined) {
        chartDef.plotConfig.width = 800;
    }

    if (chartDef.plotConfig.height === undefined) {
        chartDef.plotConfig.height = 600;
    }

    if (!chartDef.axisMap) {
        chartDef.axisMap = { y: [], y2: [] };
    }
    else {
        chartDef.axisMap = Object.assign({}, chartDef.axisMap);
        if (!chartDef.axisMap.y) {
            chartDef.axisMap.y = [];
        }

        if (!chartDef.axisMap.y2) {
            chartDef.axisMap.y2 = [];
        }
    }

    if (chartDef.axisMap.y.length === 0 &&
        chartDef.axisMap.y2.length === 0) {
        chartDef.axisMap.y = expandYSeriesConfigArray(chartDef.data.columnOrder);
    }

    return chartDef;
}
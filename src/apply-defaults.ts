import { IChartDef, ChartType, IYAxisSeriesConfig } from "@data-forge-plot/chart-def";
import { expandYSeriesConfigArray, expandPlotConfig } from "./expand-chart-def";
import { IPlotConfig } from "./chart-def";
import { ISerializedDataFrame } from "@data-forge/serialization";

//
// Extract series from the chart definition's data.
//
function extractValues(data: ISerializedDataFrame, seriesConfigs: IYAxisSeriesConfig[]): any[] {
    const values = seriesConfigs
        .filter(axis => data && data.columns && data.columns[axis.series] === "number")
        .map(axis => data.values && data.values.map(row => row[axis.series]) || []);
    const flattened = [].concat.apply([], values); // Flatten array of arrays.
    return flattened;
}

function findMin(values: number[]): number {
    return Math.min(...values.filter(v => v !== undefined && v !== null && !Number.isNaN(v)));
}

function findMax(values: number[]): number {
    return Math.max(...values.filter(v => v !== undefined && v !== null && !Number.isNaN(v) && Number.isFinite(v)));
}

//
// Apply defaults to a chart definition and patch misssing values.
//
export function applyDefaults(inputChartDef: IChartDef, plotDefaults?: IPlotConfig): IChartDef {

    const chartDef = Object.assign({}, inputChartDef);

    if (!chartDef.plotConfig) {
        if (plotDefaults) {
            chartDef.plotConfig = Object.assign({}, expandPlotConfig(plotDefaults));
        }
        else {
            chartDef.plotConfig = {};
        }
    }
    else {
        if (plotDefaults) {
            chartDef.plotConfig = Object.assign({}, expandPlotConfig(plotDefaults), chartDef.plotConfig);
        }
        else {
            chartDef.plotConfig = Object.assign({}, chartDef.plotConfig);
        }
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

    if (!chartDef.plotConfig.y) {
        chartDef.plotConfig.y = {};
    }

    let y1Values;

    if (chartDef.plotConfig.y.min === undefined) {
        y1Values = extractValues(chartDef.data, chartDef.axisMap.y);

        if (y1Values.length > 0) {        
            chartDef.plotConfig.y.min = findMin(y1Values);
        }
    }

    if (chartDef.plotConfig.y.max === undefined) {
        if (!y1Values) {
            y1Values = extractValues(chartDef.data, chartDef.axisMap.y);
        }

        if (y1Values.length > 0) {        
            chartDef.plotConfig.y.max = findMax(y1Values);
        }
    }

    if (!chartDef.plotConfig.y2) {
        chartDef.plotConfig.y2 = {};
    }

    let y2Values;

    if (chartDef.plotConfig.y2.min === undefined) {
        y2Values = extractValues(chartDef.data, chartDef.axisMap.y2);
        if (y2Values.length > 0) {
            chartDef.plotConfig.y2.min = findMin(y2Values);
        }
    }

    if (chartDef.plotConfig.y2.max === undefined) {
        if (!y2Values) {
            y2Values = extractValues(chartDef.data, chartDef.axisMap.y2);
        }

        if (y2Values.length > 0) {
            chartDef.plotConfig.y2.max = findMax(y2Values);
        }
    }

    return chartDef;
}

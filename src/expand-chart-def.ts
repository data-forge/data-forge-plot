import { IChartDef, IPlotConfig as IExpandedPlotConfig, IAxisMap as IExpandedAxisMap, ChartType, IAxisConfig as IExpandedAxisConfig, IYAxisConfig as IExpandedYAxisConfig, IAxisSeriesConfig as IExpandedAxisSeriesConfig, IYAxisSeriesConfig as IExpandedYAxisSeriesConfig } from "@data-forge-plot/chart-def";
import { IAxisMap, IPlotConfig, IAxisConfig, IYAxisConfig, IAxisSeriesConfig, IYAxisSeriesConfig } from "./chart-def";
import { ISerializedDataFrame } from "@data-forge/serialization";
import { isString } from "./utils";
import { isObject, isArray } from "util";

//
// Expands a chart definition so that chart renderer plugins have less work to do.
//

export function expandAxisConfig(axisConfig: IAxisConfig): IExpandedAxisConfig {
    const expandedAxisConfig = Object.assign({}, axisConfig) as IExpandedAxisConfig;
    if (isString(expandedAxisConfig.label))  {
        expandedAxisConfig.label = {
            text: expandedAxisConfig.label,
        };
    }

    return expandedAxisConfig;
}

export function expandYAxisConfig(axisConfig: IYAxisConfig): IExpandedYAxisConfig {
    const expandedAxisConfig = expandAxisConfig(axisConfig);
    return expandedAxisConfig;
}

export function expandSeriesConfig(series: string | IAxisSeriesConfig): IExpandedAxisSeriesConfig {
    if (isString(series)) {
        return {
            series: series as string,
        };
    }
    else {
        return Object.assign({}, series);
    }
}

export function expandYSeriesConfig(series: string | IYAxisSeriesConfig): IExpandedYAxisSeriesConfig {
    const expanded = expandSeriesConfig(series) as IExpandedYAxisSeriesConfig;
    if (expanded.x) {
        expanded.x = expandSeriesConfig(expanded.x);
    }
    return expanded;
}

export function expandYSeriesConfigArray(series?: string | string[] | IYAxisSeriesConfig | IYAxisSeriesConfig[]): IExpandedYAxisSeriesConfig[] {
    if (!series) {
        return [];
    }

    if (isString(series)) {
        return [{
            series,
        }];
    }

    if (isArray(series)) {
        return (series as Array<any>).map(expandYSeriesConfig);
    }

    if (isObject(series)) {
        return [
            expandYSeriesConfig(series as IYAxisSeriesConfig),
        ];
    }

    throw new Error(`Unexpected type for series: ${series}.`);
}

export function expandAxisMap(axisMap: IAxisMap, columns: string[]): IExpandedAxisMap {
    const expandedAxisMap = Object.assign({}, axisMap) as IExpandedAxisMap;
    if (axisMap.x) {
        expandedAxisMap.x = expandSeriesConfig(axisMap.x);
    }

    if ((!axisMap.y ||  (isArray(axisMap.y)  && axisMap.y.length === 0)) &&
        (!axisMap.y2 || (isArray(axisMap.y2) && axisMap.y2.length === 0))) {
        expandedAxisMap.y = expandYSeriesConfigArray(columns);
        expandedAxisMap.y2 = [];        
    }
    else {
        expandedAxisMap.y = expandYSeriesConfigArray(axisMap.y);
        expandedAxisMap.y2 = expandYSeriesConfigArray(axisMap.y2);
    }

    return expandedAxisMap;
}

export function expandChartDef(data: ISerializedDataFrame, plotConfig: IPlotConfig, axisMap: IAxisMap): IChartDef {

    const expandedPlotConfig = Object.assign({}, plotConfig);
    const expandedAxisMap = expandAxisMap(axisMap, data.columnOrder);

    if (plotConfig.x) {
        expandedPlotConfig.x = expandAxisConfig(plotConfig.x);
    }

    if (plotConfig.y) {
        expandedPlotConfig.y = expandYAxisConfig(plotConfig.y);
    }

    if (plotConfig.y2) {
        expandedPlotConfig.y2 = expandYAxisConfig(plotConfig.y2);
    }

    if (expandedPlotConfig.chartType === undefined) {
        expandedPlotConfig.chartType = ChartType.Line;  
    }

    return {
        data,
        plotConfig: expandedPlotConfig as IExpandedPlotConfig,
        axisMap: expandedAxisMap as IExpandedAxisMap,
    };
}

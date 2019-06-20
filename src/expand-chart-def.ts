import { IChartDef, IPlotConfig as IExpandedPlotConfig, IAxisMap as IExpandedAxisMap, IAxisConfig as IExpandedAxisConfig, IYAxisConfig as IExpandedYAxisConfig, IXAxisConfig as IExpandedXAxisConfig, IAxisSeriesConfig as IExpandedAxisSeriesConfig, IYAxisSeriesConfig as IExpandedYAxisSeriesConfig, ISeriesLabelConfig } from "@data-forge-plot/chart-def";
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

export function expandXAxisConfig(axisConfig: IYAxisConfig): IExpandedXAxisConfig {
    const expandedAxisConfig = expandAxisConfig(axisConfig);
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
        const inputSeriesConfig = series as IAxisSeriesConfig;
        const expandedSeriesConfig: IExpandedAxisSeriesConfig = {
            series: inputSeriesConfig.series,
        };

        if (inputSeriesConfig.label) {
            expandedSeriesConfig.label = inputSeriesConfig.label;
        }

        if (inputSeriesConfig.format) {
            expandedSeriesConfig.format = inputSeriesConfig.format;
        }

        if (inputSeriesConfig.color) {
            expandedSeriesConfig.color = inputSeriesConfig.color;
        }

        return expandedSeriesConfig;
    }
}

export function expandYSeriesConfig(series: string | IYAxisSeriesConfig): IExpandedYAxisSeriesConfig {
    const expanded = expandSeriesConfig(series) as IExpandedYAxisSeriesConfig;
    if (!isString(series)) {
        if (series.x) {
            expanded.x = expandSeriesConfig(series.x);
        }
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

    expandedAxisMap.y = expandYSeriesConfigArray(axisMap.y);
    expandedAxisMap.y2 = expandYSeriesConfigArray(axisMap.y2);

    return expandedAxisMap;
}

export function expandPlotConfig(plotConfig: IPlotConfig): IExpandedPlotConfig {
    const expandedPlotConfig = Object.assign({}, plotConfig) as IExpandedPlotConfig;
    if (plotConfig.x) {
        expandedPlotConfig.x = expandAxisConfig(plotConfig.x);
    }

    if (plotConfig.y) {
        expandedPlotConfig.y = expandYAxisConfig(plotConfig.y);
    }

    if (plotConfig.y2) {
        expandedPlotConfig.y2 = expandYAxisConfig(plotConfig.y2);
    }

    return expandedPlotConfig;
}

export function expandChartDef(data: ISerializedDataFrame, plotConfig: IPlotConfig, axisMap: IAxisMap): IChartDef {
    return {
        data,
        plotConfig: expandPlotConfig(plotConfig),
        axisMap: expandAxisMap(axisMap, data.columnOrder),
    };
}

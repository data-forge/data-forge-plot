import { assert } from 'chai';
import { ISeries, Series } from 'data-forge';
import { IDataFrame, DataFrame } from 'data-forge';
import { ChartRenderer, IChartRenderer } from './render-chart';
import * as Sugar from 'sugar';
import { WebServer } from './web-server';
import { IPlotAPI, PlotAPI, globalChartRenderer, defaultPlotDef, startPlot, endPlot } from './plot-api';
import { IPlotDef, ChartType, IAxisMap } from './chart-def';

//
// Augment ISeries and Series with plot function.
//
declare module "data-forge/build/lib/series" {
    interface ISeries<IndexT, ValueT> {
        startPlot(): void;
        endPlot(): void;

        plot(plotDef?: IPlotDef, axisMap?: IAxisMap): IPlotAPI;
    }

    interface Series<IndexT, ValueT> {
        startPlot(): void;
        endPlot(): void;

        plot(plotDef?: IPlotDef, axisMap?: IAxisMap): IPlotAPI;
    }
}

const defaultSeriesAxisMap = {
    "x": "__index__",
    "y": [
        "__value__",
    ],
};

function plotSeries(this: ISeries<any, any>, plotDef?: IPlotDef, axisMap?: IAxisMap): IPlotAPI {
    if (!plotDef) {
        plotDef = defaultPlotDef;
    }

    axisMap = Object.assign({}, defaultSeriesAxisMap, axisMap);

    const amt = this.count();
    const serializedData = this.inflate((value: any) => ({ __value__: value }))
        .zip(this.getIndex().head(amt), (row: any, index: any) => {
            row.__index__ = index;
            return row;
        })
        .serialize();
    return new PlotAPI(serializedData, plotDef, axisMap!);
}

Series.prototype.startPlot = startPlot;
Series.prototype.endPlot = endPlot;
Series.prototype.plot = plotSeries;

//
// Augment IDataFrame and DataFrame with plot function.
//
declare module "data-forge/build/lib/dataframe" {
    interface IDataFrame<IndexT, ValueT> {
        startPlot(): void;
        endPlot(): void;

        plot(plotDef?: IPlotDef, axisMap?: IAxisMap): IPlotAPI;
    }

    interface DataFrame<IndexT, ValueT> {
        startPlot(): void;
        endPlot(): void;

        plot(plotDef?: IPlotDef, axisMap?: IAxisMap): IPlotAPI;
    }
}

function plotDataFrame(this: IDataFrame<any, any>, plotDef?: IPlotDef, axisMap?: IAxisMap): IPlotAPI {
    if (!plotDef) {
        plotDef = defaultPlotDef;
    }

    if (!axisMap) {
        axisMap = {
            x: "__index__",
            y: this.getColumnNames(),
        };
    }
    else {
        axisMap = Object.assign({}, axisMap);
        if (!axisMap.x) {
            axisMap.x = "__index__";
        }

        if (!axisMap.y) {
            if (!axisMap.y2) {
                // All columns on the y axis.
                axisMap.y = this.getColumnNames();
            }
            else {
                // All columns on y axis, expect those explicitly on the y2 axis.
                axisMap.y = this.getColumnNames()
                    .filter(columnName => {
                        if (Sugar.Object.isArray(axisMap!.y2!)) {
                            if ((axisMap!.y2 as string[]).indexOf(columnName) >= 0) {{
                                return false; // This column is moved to y2 axis.
                            }}
                        }
                        else {
                            if (columnName === axisMap!.y2) {
                                return false; // This column is moved to y2 axis.
                            }
                        }

                        return true; // This column can stay on y axis.
                    });
            }            
        }
    }

    const includeIndex = axisMap.x === "__index__" ||
        axisMap.y === "__index__" ||
        axisMap.y2 === "__index__" ||
        (Sugar.Object.isArray(axisMap!.y!) && (axisMap!.y! as string[]).filter(y => y === "__index__").length > 0) ||
        axisMap!.y2 && (Sugar.Object.isArray(axisMap!.y2!) && (axisMap!.y2! as string[]).filter(y => y === "__index__").length > 0);

    let df = this;

    if (includeIndex) {
        const amt = this.count();
        df = df.zip(df.getIndex().head(amt), (row: any, index: any) => {
                row.__index___ = index;
                return row;
            });
    }

    const serializedData = df.serialize();
    return new PlotAPI(serializedData, plotDef, axisMap);
}

DataFrame.prototype.startPlot = startPlot;
DataFrame.prototype.endPlot = endPlot;  
DataFrame.prototype.plot = plotDataFrame;


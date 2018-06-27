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

    const defaultAxisMap = {
        x: "__index__",
        y: this.getColumnNames(),
    };

    const amt = this.count();
    const df = this.zip(this.getIndex().head(amt), (row: any, index: any) => {
            row.__index__ = index;
            return row;
        });

    const serializedData = df.serialize();
    return new PlotAPI(serializedData, plotDef, defaultAxisMap, axisMap);
}

DataFrame.prototype.startPlot = startPlot;
DataFrame.prototype.endPlot = endPlot;  
DataFrame.prototype.plot = plotDataFrame;


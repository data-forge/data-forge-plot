import { assert } from 'chai';
import { ISeries, Series } from 'data-forge';
import { IDataFrame, DataFrame } from 'data-forge';
import { ChartRenderer, IChartRenderer } from './render-chart';
import * as Sugar from 'sugar';
import { WebServer } from './web-server';
import { IPlotAPI, PlotAPI, globalChartRenderer, startPlot, endPlot } from './plot-api';
import { IPlotConfig, ChartType, IAxisMap } from './chart-def';

//
// Augment ISeries and Series with plot function.
//
declare module "data-forge/build/lib/series" {
    interface ISeries<IndexT, ValueT> {
        startPlot(): void;
        endPlot(): void;

        plot(plotDef?: IPlotConfig, axisMap?: IAxisMap): IPlotAPI;
    }

    interface Series<IndexT, ValueT> {
        startPlot(): void;
        endPlot(): void;

        plot(plotDef?: IPlotConfig, axisMap?: IAxisMap): IPlotAPI;
    }
}

function plotSeries(this: ISeries<any, any>, plotDef?: IPlotConfig, axisMap?: IAxisMap): IPlotAPI {

    const amt = this.count();
    const serializedData = this.inflate((value: any) => ({ __value__: value }))
        .zip(this.getIndex().head(amt), (row: any, index: any) => {
            row.__index__ = index;
            return row;
        })
        .serialize();
    return new PlotAPI(serializedData, plotDef || {}, axisMap!);
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

        plot(plotDef?: IPlotConfig, axisMap?: IAxisMap): IPlotAPI;
    }

    interface DataFrame<IndexT, ValueT> {
        startPlot(): void;
        endPlot(): void;

        plot(plotDef?: IPlotConfig, axisMap?: IAxisMap): IPlotAPI;
    }
}

function plotDataFrame(this: IDataFrame<any, any>, plotDef?: IPlotConfig, axisMap?: IAxisMap): IPlotAPI {
    const amt = this.count();
    const df = this.zip(this.getIndex().head(amt), (row: any, index: any) => {
            row.__index__ = index;
            return row;
        });

    const serializedData = df.serialize();
    return new PlotAPI(serializedData, plotDef || {}, axisMap);
}

DataFrame.prototype.startPlot = startPlot;
DataFrame.prototype.endPlot = endPlot;  
DataFrame.prototype.plot = plotDataFrame;


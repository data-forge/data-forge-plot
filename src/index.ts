import { ISeries, Series } from "data-forge";
import { IDataFrame, DataFrame } from "data-forge";
import { IPlotAPI, PlotAPI, /*todo: globalChartRenderer,*/ startPlot, endPlot } from "./plot-api";
import { IPlotConfig, IAxisMap } from "./chart-def";

//
// Augment ISeries and Series with plot function.
//
declare module "data-forge/build/lib/series" {
    interface ISeries<IndexT, ValueT> {
        startPlot(): void;
        endPlot(): void;

        plot(plotConfig?: IPlotConfig, axisMap?: IAxisMap): IPlotAPI;
    }

    interface Series<IndexT, ValueT> {
        startPlot(): void;
        endPlot(): void;

        plot(plotConfig?: IPlotConfig, axisMap?: IAxisMap): IPlotAPI;
    }
}

function plotSeries(this: ISeries<any, any>, plotConfig?: IPlotConfig, axisMap?: IAxisMap): IPlotAPI {

    const amt = this.count();
    const serializedData = this
        .inflate((value: any) => ({ __value__: value }))
        .serialize();
    return new PlotAPI(serializedData, plotConfig || {}, false, axisMap!);
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
    const serializedData = this.serialize();
    return new PlotAPI(serializedData, plotDef || {}, true, axisMap);
}

DataFrame.prototype.startPlot = startPlot;
DataFrame.prototype.endPlot = endPlot;
DataFrame.prototype.plot = plotDataFrame;

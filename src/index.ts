import { IAxisMap, IPlotConfig } from "@plotex/chart-def";
import { ISeries, Series } from "data-forge";
import { IDataFrame, DataFrame } from "data-forge";
import { IPlotAPI, plot } from "plot";
export { IPlotAPI } from "plot";
export * from "@plotex/chart-def";

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

const seriesPlotDefaults: IPlotConfig = {
    legend: {
        show: false,
    },
};

function plotSeries(this: ISeries<any, any>, plotConfig?: IPlotConfig, axisMap?: IAxisMap): IPlotAPI {
    return plot(this.toArray(), plotConfig, axisMap);
}

Series.prototype.plot = plotSeries;

//
// Augment IDataFrame and DataFrame with plot function.
//
declare module "data-forge/build/lib/dataframe" {
    interface IDataFrame<IndexT, ValueT> {
        plot(plotDef?: IPlotConfig, axisMap?: IAxisMap): IPlotAPI;
    }

    interface DataFrame<IndexT, ValueT> {
        plot(plotDef?: IPlotConfig, axisMap?: IAxisMap): IPlotAPI;
    }
}

const dataFramePlotDefaults: IPlotConfig = {
    legend: {
        show: true,
    },
};

function plotDataFrame(this: IDataFrame<any, any>, plotConfig?: IPlotConfig, axisMap?: IAxisMap): IPlotAPI {
    return plot(this.toArray(), plotConfig, axisMap);
}

DataFrame.prototype.plot = plotDataFrame;

import { assert } from 'chai';
import { ISeries, Series } from 'data-forge';
import { IDataFrame, DataFrame } from 'data-forge';

/**
 * Defines the chart.
 */
export interface IPlotDef {

}

/**
 * Configures the data used to generate the plot.
 */
export interface IPlotInput {

}

/**
 * Fluent API for configuring the plot.
 */
export interface IPlotAPI {
    /**
     * Render the plot to an image file.
     */
    /*async*/ renderImage (imageFilePath: string): Promise<void>;

    /**
     * Export an interfactive web visualization of the plot.
     */
    /*async*/ exportWeb (outputFolderPath: string): Promise<void>;
}

class PlotAPI implements IPlotAPI {

    /**
     * Render the plot to an image file.
     */
    async renderImage (imageFilePath: string): Promise<void> {
        return; //todo:
    }

    /**
     * Export an interfactive web visualization of the plot.
     */
    async exportWeb (outputFolderPath: string): Promise<void> {
        return; //todo;
    }
}

declare module "data-forge/build/lib/series" {
    interface ISeries<IndexT, ValueT> {
        plot (plotDef?: IPlotDef, plotInput?: IPlotInput): IPlotAPI;
    }

    interface Series<IndexT, ValueT> {
        plot (plotDef?: IPlotDef, plotInput?: IPlotInput): IPlotAPI;
    }
}

function plotSeries (this: ISeries<any, any>, plotDef?: IPlotDef, plotInput?: IPlotInput): IPlotAPI {
    return new PlotAPI();
}

Series.prototype.plot = plotSeries;

declare module "data-forge/build/lib/dataframe" {
    interface IDataFrame<IndexT, ValueT> {
        plot (plotDef?: IPlotDef, plotInput?: IPlotInput): IPlotAPI;
    }

    interface DataFrame<IndexT, ValueT> {
        plot (plotDef?: IPlotDef, plotInput?: IPlotInput): IPlotAPI;
    }
}

function plotDataFrame (this: IDataFrame<any, any>, plotDef?: IPlotDef, plotInput?: IPlotInput): IPlotAPI {
    return new PlotAPI();
}

DataFrame.prototype.plot = plotDataFrame;
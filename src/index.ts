import { assert } from 'chai';
import { ISeries, Series } from 'data-forge';
import { IDataFrame, DataFrame } from 'data-forge';
import { ChartRenderer, IChartRenderer } from './render-chart';

/** 
 * Defines the type of chart to output.
 */
export enum ChartType {
    Line = "line",
    Bar = "bar",
}

/**
 * Defines the chart.
 */
export interface IPlotDef {
    /**
     * The type of chart to render.
     */
    chartType: ChartType;

    /**
     * Width of the plot.
     */
    width: number;

    /**
     * Height of the plot.
     */
    height: number;
}

/**
 * Maps the columns in a dataframe to axis in the chart.
 */
export interface IAxisMap {
    x: string;
    y: string | string[];
    y2?: string | string[];
}

/**
 * Fluent API for configuring the plot.
 */
export interface IPlotAPI {

    /**
     * Show the chart in the Electron browser.
     * Promise resolves when browser is closed.
     */
    /*async*/ showInteractiveChart (): Promise<void>;

    /**
     * Render the plot to an image file.
     */
    /*async*/ renderImage (imageFilePath: string): Promise<void>;

    /**
     * Export an interfactive web visualization of the plot.
     */
    /*async*/ exportWeb (outputFolderPath: string): Promise<void>;

    /**
     * Serialize the plot definition to JSON.
     */
    toJSON (): any;
}

let globalChartRenderer: IChartRenderer | null = null; // Reusable chart renderer.

const defaultPlotDef: IPlotDef = {
    chartType: ChartType.Line,
    width: 300,
    height: 300,
}

class PlotAPI implements IPlotAPI {

    data: any[];
    plotDef: IPlotDef;
    axisMap: IAxisMap;

    constructor(data: any[], plotDef: IPlotDef, axisMap: IAxisMap) {

        assert.isArray(data, "Expected 'data' parameter to PlotAPI constructor to be an array.");

        this.data = data;
        this.plotDef = Object.assign({}, plotDef); // Clone the def and plot map so they can be updated by the fluent API.
        this.axisMap = Object.assign({}, axisMap);
    }
    
    /**
     * Show the chart in the Electron browser.
     * Promise resolves when browser is closed.
     */
    async showInteractiveChart (): Promise<void> {
        //todo:
    }

    /**
     * Render the plot to an image file.
     */
    async renderImage (imageFilePath: string): Promise<void> {
        if (globalChartRenderer) {
            // Reused global chart renderer.
            await globalChartRenderer.renderImage(this.data, this.plotDef, this.axisMap, imageFilePath);
        }
        else {
            // Create a new chart renderer.
            const chartRenderer: IChartRenderer = new ChartRenderer();
            await chartRenderer.start();
            await chartRenderer.renderImage(this.data,  this.plotDef, this.axisMap, imageFilePath);
            await chartRenderer.end();
        }
    }

    /**
     * Export an interfactive web visualization of the plot.
     */
    async exportWeb (outputFolderPath: string): Promise<void> {
        return; //todo;
    }

    /**
     * Serialize the plot definition to JSON.
     */
    toJSON (): any {
        return {}; //todo:
    }
}

declare module "data-forge/build/lib/series" {
    interface ISeries<IndexT, ValueT> {
        startPlot(): void;
        endPlot(): void;

        plot (plotDef?: IPlotDef, axisMap?: IAxisMap): IPlotAPI;
    }

    interface Series<IndexT, ValueT> {
        startPlot(): void;
        endPlot(): void;

        plot (plotDef?: IPlotDef, axisMap?: IAxisMap): IPlotAPI;
    }
}

async function startPlot (): Promise<void> {
    globalChartRenderer = new ChartRenderer();
    await globalChartRenderer.start();
}

async function endPlot(): Promise<void> {
    await globalChartRenderer!.end();
    globalChartRenderer = null;
}

function plotSeries (this: ISeries<any, any>, plotDef?: IPlotDef, axisMap?: IAxisMap): IPlotAPI {
    if (!plotDef) {
        plotDef = defaultPlotDef;
    }
    
    if (!axisMap) {
        axisMap = {
            "x": "__index__",
            "y": [
                "__value__",
            ],
        };
    }

    const amt = this.count();
    const dataWithIndex = this.inflate(value => ({ __value__: value }))
        .withSeries("__index__", this.getIndex().head(amt))
        .toArray(); //todo: including the index should be optional.
    return new PlotAPI(dataWithIndex, plotDef, axisMap);
}

Series.prototype.startPlot = startPlot;
Series.prototype.endPlot = endPlot;
Series.prototype.plot = plotSeries;

declare module "data-forge/build/lib/dataframe" {
    interface IDataFrame<IndexT, ValueT> {
        startPlot(): void;
        endPlot(): void;

        plot (plotDef?: IPlotDef, axisMap?: IAxisMap): IPlotAPI;
    }

    interface DataFrame<IndexT, ValueT> {
        startPlot(): void;
        endPlot(): void;

        plot (plotDef?: IPlotDef, axisMap?: IAxisMap): IPlotAPI;
    }
}

function plotDataFrame (this: IDataFrame<any, any>, plotDef?: IPlotDef, axisMap?: IAxisMap): IPlotAPI {
    if (!plotDef) {
        plotDef = defaultPlotDef;
    }
    
    if (!axisMap) {
        axisMap = {
            "x": "__index__",
            "y": this.getColumnNames(),
        };
    }

    const amt = this.count();
    const dataWithIndex = this.withSeries("__index__", this.getIndex().head(amt)).toArray(); //todo: including the index should be optional.
    return new PlotAPI(dataWithIndex, plotDef, axisMap);
}

DataFrame.prototype.startPlot = startPlot;
DataFrame.prototype.endPlot = endPlot;
DataFrame.prototype.plot = plotDataFrame;
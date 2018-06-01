import { assert } from 'chai';
import { ISeries, Series } from 'data-forge';
import { IDataFrame, DataFrame } from 'data-forge';
import { ChartRenderer, IChartRenderer } from './render-chart';
import * as Sugar from 'sugar';

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
    /**
     * The x axis for the chart.
     */
    x: string;

    /**
     * The y axis for the chart.
     */
    y: string | string[];

    /**
     * The optional  second y axis for the chart.
     */
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
     * Export an interactive web visualization of the plot.
     */
    /*async*/ exportWeb (outputFolderPath: string): Promise<void>;

    /**
     * Serialize the plot definition to JSON.
     * The JSON definition of the chart can be used to instantiate the chart in a browser.
     */
    toJSON (): any;
}

//
// Reusable chart renderer. 
// For improved performance.
//
let globalChartRenderer: IChartRenderer | null = null; 

const defaultPlotDef: IPlotDef = {
    chartType: ChartType.Line,
    width: 300,
    height: 300,
}

/**
 * Fluent API for configuring the plot.
 */
class PlotAPI implements IPlotAPI {

    /**
     * Data to be plotted.
     */
    data: any[];

    /**
     * Defines the chart that is to be plotted.
     */
    plotDef: IPlotDef;

    /**
     * Defines how the data is mapped to the axis' in the chart.
     */
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
     * Export an interactive web visualization of the plot.
     */
    async exportWeb (outputFolderPath: string): Promise<void> {
        //todo;
    }

    /**
     * Serialize the plot definition to JSON.
     */
    toJSON (): any {
        return {}; //todo:
    }
}

//
// Augment ISeries and Series with plot function.
//
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

function plotSeries (this: ISeries<any, any>, plotDef?: IPlotDef): IPlotAPI {
    if (!plotDef) {
        plotDef = defaultPlotDef;
    }
    
    const axisMap = {
        "x": "__index__",
        "y": [
            "__value__",
        ],
    };

    const amt = this.count();
    const dataWithIndex = this.inflate(value => ({ __value__: value }))
        .withSeries("__index__", this.getIndex().head(amt))
        .toArray();
    return new PlotAPI(dataWithIndex, plotDef, axisMap);
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

    const includeIndex = axisMap.x === "__index__" || 
        axisMap.y === "__index__" || 
        (Sugar.Object.isArray(axisMap.y) && 
            axisMap.y.filter(y => y === "__index__").length > 0);

    let df = this;

    if (includeIndex) {
        const amt = this.count();
        df = df.withSeries("__index__", df.getIndex().head(amt));
    }

    const data = df.toArray();
    return new PlotAPI(data, plotDef, axisMap);
}

DataFrame.prototype.startPlot = startPlot;
DataFrame.prototype.endPlot = endPlot;
DataFrame.prototype.plot = plotDataFrame;
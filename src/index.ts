import { assert } from 'chai';
import { ISeries, Series } from 'data-forge';
import { IDataFrame, DataFrame } from 'data-forge';
import { ChartRenderer, IChartRenderer } from './render-chart';
import * as Sugar from 'sugar';
import { WebServer } from './web-server';
const opn = require('opn');
import * as jetpack from 'fs-jetpack';
import * as path from 'path';
import * as fs from 'fs-extra';

/** 
 * Defines the type of chart to output.
 */
export enum ChartType {
    Line = "line",
    Bar = "bar",
    Scatter = "scatter",
}

/**
 * Defines the type of an axis.
 */
export enum AxisType {
    Indexed = "indexed",
    Timeseries = "timeseries",
    Category = "category",
}

/**
 * Defines the position of a horizontal label.
 */
export enum HorizontalLabelPosition {
    InnerRight = "inner-right", // Default
    InnerCenter = "inner-center",
    InnerLeft = "inner-left",
    OuterRight = "outer-right",
    OuterCenter = "outer-center",
    OuterLeft = "outer-left",
}

/**
 * Defines the position of a vertical label.
 */
export enum VerticalLabelPosition {
    InnerTop = "inner-top", // Default
    InnerMiddle = "inner-middle",
    InnerBottom = "inner-bottom",
    OuterTop = "outer-top",
    OuterMiddle = "outer-middle",
    OuterBottom = "outer-bottom",
}

export interface ILabelConfig {
    /**
     * The text for the label.
     */
    text?: string;

    /**
     * Position of the label.
     */
    position?: HorizontalLabelPosition | VerticalLabelPosition;
}

/**
 * Configures an axis of the chart.
 */
export interface IAxisConfig {
    /**
     * Sets the type of the axis' data.
     * Default: AxisType.Indexed ("indexed")
     */
    axisType?: AxisType;

    /**
     * Label for the axis.
     */
    label?: string | ILabelConfig;
}

/**
 * Configuration for a single series.
 */
export interface ISeriesConfig { 
    /**
     * The label for the series.
     */
    label: string;
}

/**
 * Configuration for all series.
 */
export interface ISeriesConfiguration {
    [index: string]: string | ISeriesConfig;
}

/**
 * Defines the chart.
 */
export interface IPlotDef {

    /**
     * The type of chart to render.
     */
    chartType?: ChartType;

    /**
     * Width of the plot.
     */
    width?: number;

    /**
     * Height of the plot.
     */
    height?: number;

    /**
     * Configuration for the x axis.
     */
    x?: IAxisConfig;

    /**
     * Configuration for the y axis.
     */
    y?: IAxisConfig;

    /**
     * Configuration for the second y axis.
     */
    y2?: IAxisConfig;
}

/**
 * Maps the columns in a dataframe to axis in the chart.
 */
export interface IAxisMap {

    /**
     * The x axis for the chart.
     */
    x?: string;

    /**
     * The y axis for the chart.
     */
    y?: string | string[];

    /**
     * The optional  second y axis for the chart.
     */
    y2?: string | string[];

    /**
     * Configuration for all series.
     */
    series?: ISeriesConfiguration;
}

/**
 * A chart definition that is suitable for serialization to JSON and transfer to the browser via REST API.
 * Can be used to instantiate a Data-Forge chart in the browser.
 */
export interface IChartDef {

    /**
     * JSON serializable representation of the data.
     */
    data: any[],

    /**
     * Defines the look of the chart.
     */
    plotDef: IPlotDef;

    /**
     * Maps fields in the data to axis' on the chart.
     */
    axisMap: IAxisMap;
}

/**
 * Options for exporting web projects for interactive charts.
 */
export interface IWebExportOptions {
    /**
     * Open the exported web visualization in the browser after exporting it.
     * Default: false
     */
    openBrowser?: boolean;

    /**
     * Set to true to overwrite existing output.
     * Default: false
     */
    overwrite?: boolean;
}

/**
 * Options for exporting Node.js projects for interactive charts.
 */
export interface INodejsExportOptions {

    /**
     * Set to true to overwrite existing output.
     * Default: false
     */
    overwrite?: boolean;
}

/**
 * Fluent API for configuring the plot.
 */
export interface IPlotAPI {

    /**
     * Set the type of the chart to be plotted.
     * 
     * @param chartType Specifies the chart type.
     */
    chartType(chartType: ChartType): IPlotAPI;

    /**
     * Render the plot to an image file.
     */
    /*async*/ renderImage(imageFilePath: string): Promise<void>;

    /**
     * Export an interactive web visualization of the chart.
     */
    /*async*/ exportWeb(outputFolderPath: string, exportOptions?: IWebExportOptions): Promise<void>;

    /**
     * Export a Node.js project to host a web visualization of the char.
     */
    /*async*/ exportNodejs(outputFolderPath: string, exportOptions?: INodejsExportOptions): Promise<void>;

    /**
     * Serialize the plot definition so that it can be converted to JSON.
     * The JSON definition of the chart can be used to instantiate the chart in a browser.
     */
    serialize(): IChartDef;
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
        this.plotDef = Object.assign({}, defaultPlotDef, plotDef); // Clone the def and plot map so they can be updated by the fluent API.
        this.axisMap = Object.assign({}, axisMap);
    }

    /**
     * Set the type of the chart to be plotted.
     * 
     * @param chartType Specifies the chart type.
     */
    chartType(chartType: ChartType): IPlotAPI {
        this.plotDef.chartType = chartType;
        return this;
    }

    /**
     * Render the plot to an image file.
     */
    async renderImage(imageFilePath: string): Promise<void> {
        if (globalChartRenderer) {
            // Reused global chart renderer.
            await globalChartRenderer.renderImage(this.serialize(), imageFilePath);
        }
        else {
            // Create a new chart renderer.
            const chartRenderer: IChartRenderer = new ChartRenderer();
            await chartRenderer.start(false);
            await chartRenderer.renderImage(this.serialize(), imageFilePath);
            await chartRenderer.end();
        }
    }

    /**
     * Export an interactive web visualization of the chart.
     */
    async exportWeb(outputFolderPath: string, exportOptions?: IWebExportOptions): Promise<void> {

        if (exportOptions && exportOptions.overwrite) {
            await fs.remove(outputFolderPath);
        }

        await jetpack.copyAsync(path.join(__dirname, "export-templates", "web"), outputFolderPath);

        await jetpack.copyAsync(path.join(__dirname, "web-server", "template", "format-chart-def.js"), path.join(outputFolderPath, "format-chart-def.js"));

        const jsonChartDef = JSON.stringify(this.serialize(), null, 4);

        const indexJsPath = path.join(outputFolderPath, "index.js");
        await jetpack.appendAsync(indexJsPath, "var chartDef =\r\n");
        await jetpack.appendAsync(indexJsPath, jsonChartDef);

        if (exportOptions && exportOptions.openBrowser) {
            opn("file://" + path.join(outputFolderPath, "index.html"));
        }
    }

    /**
     * Export a Node.js project to host a web visualization of the char.
     */
    async exportNodejs(outputFolderPath: string, exportOptions?: INodejsExportOptions): Promise<void> {

        if (exportOptions && exportOptions.overwrite) {
            await fs.remove(outputFolderPath);
        }

        await jetpack.copyAsync(path.join(__dirname, "export-templates", "nodejs"), outputFolderPath);

        await jetpack.copyAsync(path.join(__dirname, "web-server", "template", "format-chart-def.js"), path.join(outputFolderPath, "public", "format-chart-def.js"));

        const jsonChartDef = JSON.stringify(this.serialize(), null, 4);
        await jetpack.writeAsync(path.join(outputFolderPath, "chart-def.json"), jsonChartDef);
    }

    /**
     * Serialize the plot definition so that it can be converted to JSON.
     * The JSON definition of the chart can be used to instantiate the chart in a browser.
     */
    serialize(): IChartDef {
        return {
            data: this.data,
            plotDef: this.plotDef,
            axisMap: this.axisMap,
        };
    }
}

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

async function startPlot(): Promise<void> {
    globalChartRenderer = new ChartRenderer();
    await globalChartRenderer.start(false);
}

async function endPlot(): Promise<void> {
    await globalChartRenderer!.end();
    globalChartRenderer = null;
}

function plotSeries(this: ISeries<any, any>, plotDef?: IPlotDef): IPlotAPI {
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
            "x": "__index__",
            "y": this.getColumnNames(),
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
        df = df.withSeries("__index__", df.getIndex().head(amt));
    }

    const data = df.toArray();
    return new PlotAPI(data, plotDef, axisMap);
}

DataFrame.prototype.startPlot = startPlot;
DataFrame.prototype.endPlot = endPlot;  
DataFrame.prototype.plot = plotDataFrame;
import { ChartType, IChartDef, VerticalLabelPosition, HorizontalLabelPosition, AxisType, IPlotDef, IAxisMap, IAxisConfig } from "./chart-def";
import { assert } from "chai";
import { IChartRenderer, ChartRenderer } from "./render-chart";
const opn = require('opn');
import * as path from 'path';
import * as fs from 'fs-extra';
import { findPackageDir } from './find-package-dir';

const jetpack = require('fs-jetpack');

//
// Reusable chart renderer. 
// For improved performance.
//
export let globalChartRenderer: IChartRenderer | null = null;

export async function startPlot(): Promise<void> {
    globalChartRenderer = new ChartRenderer();
    await globalChartRenderer.start(false);
}

export async function endPlot(): Promise<void> {
    await globalChartRenderer!.end();
    globalChartRenderer = null;
}

export const defaultPlotDef: IPlotDef = {
    chartType: ChartType.Line,
}

/**
 * Options for image rendering.
 */
export interface IRenderOptions {
    /**
     * Open the image in your default image viewer.
     */
    openImage: boolean;
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
     * Set the width of the chart.
     */
    width(width: number): IPlotAPI;

    /**
     * Set the height of the chart.
     */
    height(height: number): IPlotAPI;

    /**
     * Configure the x axis.
     */
    x(): IAxisPlotAPI;

    /**
     * Configure the y axis.
     */
    y(): IAxisPlotAPI;

    /**
     * Configure the y axis.
     */
    y2(): IAxisPlotAPI;

    /**
     * Render the plot to an image file.
     */
    /*async*/ renderImage(imageFilePath: string, renderOptions?: IRenderOptions): Promise<void>;

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

/**
 * Plot API for configuring a particular axis.
 */
export interface IAxisPlotAPI extends IPlotAPI { //todo: This could be separated into vertical and horizontal axis apis.

    /**
     * Set the label for the axis.
     */
    label(label: string): IAxisPlotAPI;
    
    /**
     * Set the position for the label.
     */
    labelPosition(position: VerticalLabelPosition | HorizontalLabelPosition): IAxisPlotAPI;

    /**
     * Set the type of the axis.
     */
    axisType(axisType: AxisType): IAxisPlotAPI;

    /**
     * Add a data series to the axis.
     */
    series(seriesName: string): IAxisPlotAPI;
}

/**
 * Fluent API for configuring the plot.
 */
export class PlotAPI implements IAxisPlotAPI {

    /**
     * Data to be plotted.
     */
    data: any;

    /**
     * Defines the chart that is to be plotted.
     */
    plotDef: IPlotDef;

    /**
     * Defines how the data is mapped to the axis' in the chart.
     */
    axisMap: IAxisMap;

    /**
     * Defines the current axis being configured.
     */
    curAxisName: string;

    constructor(data: any, plotDef: IPlotDef, axisMap: IAxisMap) {

        assert.isObject(data, "Expected 'data' parameter to PlotAPI constructor to be a serialized dataframe.");

        this.data = data;
        this.plotDef = Object.assign({}, defaultPlotDef, plotDef); // Clone the def and plot map so they can be updated by the fluent API.
        this.axisMap = Object.assign({}, axisMap);
        this.curAxisName = "x";
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
     * Set the width of the chart.
     */
    width(width: number): IPlotAPI {
        this.plotDef.width = width;
        return this;
    }

    /**
     * Set the height of the chart.
     */
    height(height: number): IPlotAPI {
        this.plotDef.height = height;
        return this;
    }

    /**
     * Configure the x axis.
     */
    x(): IAxisPlotAPI {
        this.curAxisName = "x";
        return this;
    }

    /**
     * Configure the y axis.
     */
    y(): IAxisPlotAPI {
        this.curAxisName = "y";
        return this;
    }

    /**
     * Configure the y axis.
     */
    y2(): IAxisPlotAPI {
        this.curAxisName = "y2";
        return this;
    }

    /**
     * Set the label for the axis.
     */
    label(label: string): IAxisPlotAPI {
        const plotDef = this.plotDef as any;
        if (!plotDef[this.curAxisName]) {
            plotDef[this.curAxisName] = {};
        }

        const axisConfig: IAxisConfig = plotDef[this.curAxisName];
        if (!axisConfig.label) {
            axisConfig.label = {};
        }
        else if (typeof(axisConfig.label) === "string") {
            axisConfig.label = {};
        }

        axisConfig.label.text = label;
        return this;
    }
    
    /**
     * Set the position for the label.
     */
    labelPosition(position: VerticalLabelPosition | HorizontalLabelPosition): IAxisPlotAPI {
        const plotDef = this.plotDef as any;
        if (!plotDef[this.curAxisName]) {
            plotDef[this.curAxisName] = {};
        }

        const axisConfig: IAxisConfig = plotDef[this.curAxisName];
        if (!axisConfig.label) {
            axisConfig.label = {};
        }
        else if (typeof(axisConfig.label) === "string") {
            axisConfig.label = {
                text: axisConfig.label,
            };
        }

        axisConfig.label.position = position;
        return this;
    }

    /**
     * Set the type of the axis.
     */
    axisType(axisType: AxisType): IAxisPlotAPI {
        const plotDef = this.plotDef as any;
        if (!plotDef[this.curAxisName]) {
            plotDef[this.curAxisName] = {};
        }

        const axisConfig: IAxisConfig = plotDef[this.curAxisName];
        axisConfig.axisType = axisType;        
        return this;
    }

    /**
     * Add a data series to the axis.
     */
    series(seriesName: string): IAxisPlotAPI {
        const axisMap = this.axisMap as any;
        if (!axisMap[this.curAxisName]) {
            axisMap[this.curAxisName] = {};
        }

        if (Sugar.Object.isString(axisMap[this.curAxisName])) {
            axisMap[this.curAxisName] = [axisMap[this.curAxisName], seriesName]; // Add second series to axis.
        }
        else if (Sugar.Object.isArray(axisMap[this.curAxisName])) {
            axisMap[this.curAxisName].push(seriesName); // Add next series to axis.
        }
        else {
            axisMap[this.curAxisName] = seriesName; // Add first series to axis.
        }
        
        return this;
    }

    /**
     * Render the plot to an image file.
     */
    async renderImage(imageFilePath: string, renderOptions?: IRenderOptions): Promise<void> {
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

        if (renderOptions && renderOptions.openImage) {
            opn(path.resolve(imageFilePath));
        }
    }

    /**
     * Export an interactive web visualization of the chart.
     */
    async exportWeb(outputFolderPath: string, exportOptions?: IWebExportOptions): Promise<void> {

        if (exportOptions && exportOptions.overwrite) {
            await fs.remove(outputFolderPath);
        }

        const packageFolderPath = await findPackageDir(__dirname);

        await jetpack.copyAsync(path.join(packageFolderPath, "templates", "web"), outputFolderPath);
        await jetpack.copyAsync(path.join(packageFolderPath, "templates", "image", "format-chart-def.js"), path.join(outputFolderPath, "format-chart-def.js"));

        const jsonChartDef = JSON.stringify(this.serialize(), null, 4);

        const indexJsPath = path.join(outputFolderPath, "index.js");
        await jetpack.appendAsync(indexJsPath, "var chartDef =\r\n");
        await jetpack.appendAsync(indexJsPath, jsonChartDef);

        if (exportOptions && exportOptions.openBrowser) {
            opn("file://" + path.resolve(path.join(outputFolderPath, "index.html")));
        }
    }

    /**
     * Export a Node.js project to host a web visualization of the char.
     */
    async exportNodejs(outputFolderPath: string, exportOptions?: INodejsExportOptions): Promise<void> {

        if (exportOptions && exportOptions.overwrite) {
            await fs.remove(outputFolderPath);
        }

        const packageFolderPath = await findPackageDir(__dirname);

        await jetpack.copyAsync(path.join(packageFolderPath, "templates", "nodejs"), outputFolderPath);
        await jetpack.copyAsync(path.join(packageFolderPath, "templates", "image", "format-chart-def.js"), path.join(outputFolderPath, "public", "format-chart-def.js"));

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

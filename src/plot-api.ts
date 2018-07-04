import { ChartType, IChartDef, VerticalLabelPosition, HorizontalLabelPosition, AxisType, IPlotConfig, IAxisMap, IAxisConfig, IExpandedAxisMap, ISingleAxisMap, ISingleYAxisMap } from "./chart-def";
import { assert } from "chai";
import { IChartRenderer, ChartRenderer } from "./render-chart";
const opn = require('opn');
import * as path from 'path';
import * as fs from 'fs-extra';
import * as Sugar from 'sugar';
import { findPackageDir } from './find-package-dir';
import { ISerializedDataFrame } from 'data-forge/build/lib/dataframe';

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

export const defaultPlotDef: IPlotConfig = {
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
    x(seriesName: string): IXAxisConfigAPI;

    /**
     * Configure the y axis.
     */
    y(seriesName: string): IYAxisConfigAPI;

    /**
     * Configure the y axis.
     */
    y2(seriesName: string): IYAxisConfigAPI;

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
export interface IAxisConfigAPI<FluentT> extends IPlotAPI {

    /**
     * Set the label for the axis.
     */
    axisLabel(label: string): FluentT;
    
    /**
     * Set the type of the axis.
     */
    type(axisType: AxisType): FluentT;
}

/**
 * Plot API for configuring a particular axis.
 */
export interface IXAxisConfigAPI extends IAxisConfigAPI<IXAxisConfigAPI> {

    /**
     * Set the position for the label.
     */
    axisLabelPosition(position: HorizontalLabelPosition): IXAxisConfigAPI;
}

/**
 * Plot API for configuring a particular Y axis.
 */
export interface IYAxisConfigAPI extends IAxisConfigAPI<IYAxisConfigAPI> {

    /**
     * Set the series label.
     */
    seriesLabel(label: string): IYAxisConfigAPI;
    
    /**
     * Set the display format for values of this series.
     */
    format(formatString: string): IYAxisConfigAPI;
    
    /**
     * Set the position for the label.
     */
    axisLabelPosition(position: VerticalLabelPosition): IYAxisConfigAPI;
    
    /**
     * Configure an explicit x axis for the y axis.
     */
    x(seriesName: string): IXAxisConfigAPI;
}

//
// Maps the columns in a dataframe to axis in the chart.
//
export interface IInternalAxisMap {

    /**
     * The x axis for the chart.
     */
    x: ISingleAxisMap;

    /**
     * The y axis for the chart.
     */
    y: ISingleYAxisMap[];

    /**
     * The optional  second y axis for the chart.
     */
    y2: ISingleYAxisMap[];
}

/**
 * Fluent API for configuring the plot.
 */
export abstract class AbstractPlotAPI implements IPlotAPI {

    /**
     * Data to be plotted.
     */
    protected data: ISerializedDataFrame;

    /**
     * Defines the chart that is to be plotted.
     */
    protected plotConfig: IPlotConfig;

    /**
     * Defines how the data is mapped to the axis' in the chart.
     */
    protected globalAxisMap: IInternalAxisMap;

    constructor(data: ISerializedDataFrame, plotConfig: IPlotConfig, globalAxisMap: IInternalAxisMap) {
    
        this.data = data;
        this.plotConfig = plotConfig;
        this.globalAxisMap = globalAxisMap;
    }

    /**
     * Set the type of the chart to be plotted.
     * 
     * @param chartType Specifies the chart type.
     */
    chartType(chartType: ChartType): IPlotAPI {
        this.plotConfig.chartType = chartType;
        return this;
    }

    /**
     * Set the width of the chart.
     */
     width(width: number): IPlotAPI {
        this.plotConfig.width = width;
        return this;
    }

    /**
     * Set the height of the chart.
     */
    height(height: number): IPlotAPI {
        this.plotConfig.height = height;
        return this;
    }

    /**
     * Configure the default x axis.
     */
    x(seriesName: string): IXAxisConfigAPI {
        this.globalAxisMap.x.series = seriesName;
        return new XAxisConfigAPI("x", seriesName, this.plotConfig.x!, this.globalAxisMap.x, this.data, this.plotConfig, this.globalAxisMap);
    }

    /**
     * Configure the y axis.
     */
    y(seriesName: string): IYAxisConfigAPI {
        const singleAxisMap: ISingleYAxisMap = { series: seriesName };
        (this.globalAxisMap.y as ISingleYAxisMap[]).push(singleAxisMap);
        return new YAxisConfigAPI("y", seriesName, this.plotConfig.y!, singleAxisMap, this.data, this.plotConfig, this.globalAxisMap);
    }

    /**
     * Configure the y axis.
     */
    y2(seriesName: string): IYAxisConfigAPI {
        const singleAxisMap: ISingleYAxisMap = { series: seriesName };
        (this.globalAxisMap.y2 as ISingleYAxisMap[]).push(singleAxisMap);
        return new YAxisConfigAPI("y2", seriesName, this.plotConfig.y2!, singleAxisMap, this.data, this.plotConfig, this.globalAxisMap);
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
            plotDef: this.plotConfig,
            axisMap: this.globalAxisMap,
        };
    }
}

/**
 * Fluent API for configuring the plot.
 */
export class PlotAPI extends AbstractPlotAPI {

    constructor(data: ISerializedDataFrame, plotConfig: IPlotConfig, globalAxisMap?: IAxisMap) {
        assert.isObject(data, "Expected 'data' parameter to PlotAPI constructor to be a serialized dataframe.");

        const expandedPlotConfig: IPlotConfig = Object.assign({}, defaultPlotDef, plotConfig); // Clone the def and plot map so they can be updated by the fluent API.
        if (expandedPlotConfig.x) {
            expandedPlotConfig.x = {};
        }

        if (expandedPlotConfig.y) {
            expandedPlotConfig.y = {};
        }

        if (expandedPlotConfig.y2) {
            expandedPlotConfig.y2 = {};
        }
        
        const expandedGlobalAxisMap: IInternalAxisMap = {
            x: { 
                series: "__index__",
            },
            y: [],
            y2: [],
        };

        if (globalAxisMap) {
            if (globalAxisMap.x) {
                if (Sugar.Object.isString(globalAxisMap.x)) {
                    expandedGlobalAxisMap.x = {
                        series: globalAxisMap.x,
                    };
                }
                else {
                    expandedGlobalAxisMap.x = globalAxisMap.x as ISingleAxisMap;
                }   
            }    

            if (globalAxisMap.y) {
                if (Sugar.Object.isString(globalAxisMap.y)) {
                    expandedGlobalAxisMap.y = [ 
                        {
                            series: globalAxisMap.y,
                        },
                    ];
                }
                else if (Sugar.Object.isArray(globalAxisMap.y)) {
                    expandedGlobalAxisMap.y = (globalAxisMap.y as any[]).map(series => {
                        if (Sugar.Object.isString(series)) {
                            return {
                                series: series,
                            };
                        }
                        else {
                            return series;
                        }
                    });
                }
                else {
                    expandedGlobalAxisMap.y = [ 
                        globalAxisMap.y,
                    ];            
                }        
            }
            else {
                expandedGlobalAxisMap.y = [];
            }

            if (globalAxisMap.y2) {
                if (Sugar.Object.isString(globalAxisMap.y2)) {
                    expandedGlobalAxisMap.y2 = [ 
                        {
                            series: globalAxisMap.y2,
                        },
                    ];
                }
                else if (Sugar.Object.isArray(globalAxisMap.y2)) {
                    expandedGlobalAxisMap.y2 = (globalAxisMap.y2 as any[]).map(series => {
                        if (Sugar.Object.isString(series)) {
                            return {
                                series: series,
                            };
                        }
                        else {
                            return series;
                        }
                    });
                }
                else {
                    expandedGlobalAxisMap.y2 = [ 
                        globalAxisMap.y2,
                    ];            
                }        
            }
        }

        if (expandedGlobalAxisMap.y.length === 0) {
            // Default the primary Y axis.
            expandedGlobalAxisMap.y = data.columnOrder
                .filter(columnName => columnName !== expandedGlobalAxisMap.x.series)
                .map(columnName => ({
                    series: columnName,
                }));
        }
        
        super(data, expandedPlotConfig, expandedGlobalAxisMap);
    }
}

/**
 * Fluent API for configuring an axis of the chart.
 */
class AxisConfigAPI<FluentT, AxisMapT> extends AbstractPlotAPI implements IAxisConfigAPI<FluentT> {

    /**
     * The name of the axis being configured.
     */
    protected axisName: string;

    /**
     * The name of the series being added to the axis.
     */
    protected seriesName: string;

    /**
     * Configuration for the axis.
     */
    protected axisConfig: IAxisConfig;

    /**
     * Series map for the axis.
     */
    protected singleAxisMap: AxisMapT;

    constructor(axisName: string, seriesName: string, axisConfig: IAxisConfig, singleAxisMap: AxisMapT, data: ISerializedDataFrame, plotConfig: IPlotConfig, globalAxisMap: IInternalAxisMap) {
        super(data, plotConfig, globalAxisMap);

        this.axisName = axisName;
        this.seriesName = seriesName;
        this.axisConfig = axisConfig;
        this.singleAxisMap = singleAxisMap;
    }
    
    /**
     * Set the label for the axis.
     */
    axisLabel(label: string): FluentT {

        if (!this.axisConfig.label) {
            this.axisConfig.label = {};
        }
        else if (typeof(this.axisConfig.label) === "string") {
            this.axisConfig.label = {};
        }

        this.axisConfig.label.text = label;
        return this as any as FluentT;
    }
    
    /**
     * Set the type of the axis.
     */
    type(axisType: AxisType): FluentT {
        this.axisConfig.axisType = axisType;        
        return this as any as FluentT;
    }

}

/**
 * Fluent API for configuring an axis of the chart.
 */
class XAxisConfigAPI extends AxisConfigAPI<IXAxisConfigAPI, ISingleAxisMap> implements IXAxisConfigAPI {

    constructor(axisName: string, seriesName: string, axisConfig: IAxisConfig, singleAxisMap: ISingleAxisMap, data: ISerializedDataFrame, plotConfig: IPlotConfig, globalAxisMap: IInternalAxisMap) {
        super(axisName, seriesName, axisConfig, singleAxisMap, data, plotConfig, globalAxisMap);
    }
    
    /**
     * Set the position for the label.
     */
    axisLabelPosition(position: HorizontalLabelPosition): IXAxisConfigAPI {
        if (!this.axisConfig.label) {
            this.axisConfig.label = {};
        }
        else if (typeof(this.axisConfig.label) === "string") {
            this.axisConfig.label = {
                text: this.axisConfig.label,
            };
        }

        this.axisConfig.label.position = position;
        return this;
    }
}

/**
 * Fluent API for configuring an axis of the chart.
 */
class YAxisConfigAPI extends AxisConfigAPI<IYAxisConfigAPI, ISingleYAxisMap> implements IYAxisConfigAPI {

    constructor(axisName: string, seriesName: string, axisConfig: IAxisConfig, singleAxisMap: ISingleAxisMap, data: ISerializedDataFrame, plotConfig: IPlotConfig, globalAxisMap: IInternalAxisMap) {
        super(axisName, seriesName, axisConfig, singleAxisMap, data, plotConfig, globalAxisMap);
    }

    /**
     * Set the label for the series.
     */
    seriesLabel(label: string): IYAxisConfigAPI  {
        this.singleAxisMap.label = label;
        return this;
    }

    /**
     * Set the display format for values of this series.
     */
    format(formatString: string): IYAxisConfigAPI  {
        this.singleAxisMap.format = formatString;
        return this;
    }
    
    /**
     * Set the position for the label.
     */
    axisLabelPosition(position: VerticalLabelPosition): IYAxisConfigAPI {
        if (!this.axisConfig.label) {
            this.axisConfig.label = {};
        }
        else if (typeof(this.axisConfig.label) === "string") {
            this.axisConfig.label = {
                text: this.axisConfig.label,
            };
        }

        this.axisConfig.label.position = position;
        return this;
    }

    /**
     * Configure an explicit x axis for the y axis.
     */
    x(seriesName: string): IXAxisConfigAPI {
        if (!this.singleAxisMap.x) {
            this.singleAxisMap.x = { series: seriesName };
        }
        else if (Sugar.Object.isString(this.singleAxisMap.x)) {
            this.singleAxisMap.x = { series: seriesName };
        }
        else {
            this.singleAxisMap.x.series = seriesName;
        }

        return new XAxisConfigAPI("x", seriesName, this.plotConfig.x!, this.singleAxisMap.x, this.data, this.plotConfig, this.globalAxisMap);
    }
}

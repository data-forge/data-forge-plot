const opn = require("opn");
import * as path from "path";
import { ISerializedDataFrame } from "@data-forge/serialization";
import { exportTemplate, IExportOptions } from "inflate-template";
import { IPlotConfig, IAxisMap } from "./chart-def";
import { isObject } from "./utils";
import { ChartType, IChartDef, AxisType, HorizontalLabelPosition, VerticalLabelPosition, IAxisConfig, IYAxisSeriesConfig, IAxisSeriesConfig, IXAxisConfig, IYAxisConfig } from "@data-forge-plot/chart-def";
import { expandChartDef } from "./expand-chart-def";
import { applyDefaults } from "./apply-defaults";

const DEFAULT_CHART_PACKAGE = "@data-forge-plot/apex";

//
// Reusable chart renderer.
// For improved performance.
//
// TODO :export let globalChartRenderer: IChartRenderer | null = null;

export async function findChartTemplatePath(): Promise<string> {
    const defaultTemplatePath = require.resolve(`${DEFAULT_CHART_PACKAGE}/build/template/template.json`);
    const chartTemplatesPath = path.dirname(defaultTemplatePath);
    return chartTemplatesPath;
}

export async function startPlot(): Promise<void> {
    /*TODO:
    globalChartRenderer = new ChartRenderer();

    const chartTemplatesPath = await findChartTemplatesPath();
    await globalChartRenderer.start(chartTemplatesPath, false);
    */
}

export async function endPlot(): Promise<void> {
    /*TODO:
    await globalChartRenderer!.end();
    globalChartRenderer = null;
    */
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

    /**
     * Name of the template used to render the image.
     */
    template?: string;

    /**
     * Set to true to show the chart definition after expansion and also after formatting.
     */
    showChartDef?: boolean;
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
    width(width: number | string): IPlotAPI;

    /**
     * Set the height of the chart.
     */
    height(height: number | string): IPlotAPI;

    /**
     * Configure the x axis.
     */
    x(): IXAxisConfigAPI;

    /**
     * Configure the y axis.
     */
    y(): IYAxisConfigAPI;

    /**
     * Configure the y axis.
     */
    y2(): IYAxisConfigAPI;

    /**
     * Export an interactive web visualization of the chart.
     */
    exportWeb(outputFolderPath: string, exportOptions?: IWebExportOptions): Promise<void>;

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
    label(label: string): FluentT;
}

/**
 * Configure a series.
 */
export interface IAxisSeriesConfigAPI extends IPlotAPI {
}

/**
 * Configure an X axis series.
 */
export interface IXAxisSeriesConfigAPI extends IAxisSeriesConfigAPI {
    
}

/**
 * Configure a Y axis series.
 */
export interface IYAxisSeriesConfigAPI extends IAxisSeriesConfigAPI {

    /**
     * Set the series label.
     */
    label(label: string): IYAxisSeriesConfigAPI;

    /**
     * Set the display format for values of this series.
     */
    format(formatString: string): IYAxisSeriesConfigAPI;

    /**
     * Configure an explicit x axis for this series.
     */
    setX(seriesName: string): IXAxisSeriesConfigAPI;
}

/**
 * Plot API for configuring a particular axis.
 */
export interface IXAxisConfigAPI extends IAxisConfigAPI<IXAxisConfigAPI> {

    /**
     * Set the series for the x axis.
     */
    setSeries(seriesName: string): IXAxisSeriesConfigAPI;

    /**
     * Set the type of the axis.
     */
    type(axisType: AxisType): IXAxisSeriesConfigAPI;

    /**
     * Set the position for the label.
     */
    labelPosition(position: HorizontalLabelPosition): IXAxisConfigAPI;
}

/**
 * Plot API for configuring a particular Y axis.
 */
export interface IYAxisConfigAPI extends IAxisConfigAPI<IYAxisConfigAPI> {

    /**
     * Add a series to a Y axis.
     */
    addSeries(seriesName: string): IYAxisSeriesConfigAPI;

    /**
     * Set the position for the label.
     */
    labelPosition(position: VerticalLabelPosition): IYAxisConfigAPI;

    /**
     * Sets the minimum value to render on the axis.
     * @param value The minimum value to render.
     */
    min(value: number): IYAxisConfigAPI;

    /**
     * Sets the maximum value to render on the axis.
     * @param value The maximum value to render.
     */
    max(value: number): IYAxisConfigAPI;
}

/**
 * Fluent API for configuring the plot.
 */
export abstract class AbstractPlotAPI implements IPlotAPI {

    //
    // The expanded chart def.
    //
    protected chartDef: IChartDef;

    //
    // Defaults for the chart configuration.
    //
    private plotDefaults?: IPlotConfig;

    constructor(chartDef: IChartDef, plotDefaults?: IPlotConfig) {
        this.chartDef = chartDef;
        this.plotDefaults = plotDefaults;
    }

    /**
     * Set the type of the chart to be plotted.
     *
     * @param chartType Specifies the chart type.
     */
    chartType(chartType: ChartType): IPlotAPI {
        this.chartDef.plotConfig.chartType = chartType; // TODO: could call toLower, would have to also toLower the config.
        return this;
    }

    /**
     * Set the width of the chart.
     */
     width(width: number | string): IPlotAPI {
        this.chartDef.plotConfig.width = width;
        return this;
    }

    /**
     * Set the height of the chart.
     */
    height(height: number | string): IPlotAPI {
        this.chartDef.plotConfig.height = height;
        return this;
    }

    /**
     * Configure the default x axis.
     */
    x(): IXAxisConfigAPI {
        if (!this.chartDef.plotConfig.x) {
            this.chartDef.plotConfig.x = {};
        }

        return new XAxisConfigAPI(
            "x",
            this.chartDef.plotConfig.x,
            (seriesName: string) => {
                if (this.chartDef.axisMap.x) {
                    this.chartDef.axisMap.x.series = seriesName;
                    return this.chartDef.axisMap.x;
                }
                else {
                    const seriesConfig: IAxisSeriesConfig = {
                        series: seriesName,
                    };
                    this.chartDef.axisMap.x = seriesConfig;
                    return seriesConfig;
                }
            },
            this.chartDef
        );
    }

    /**
     * Configure the y axis.
     */
    y(): IYAxisConfigAPI {
        if (!this.chartDef.plotConfig.y) {
            this.chartDef.plotConfig.y = {};
        }

        return new YAxisConfigAPI(
            "y",
            this.chartDef.plotConfig.y!,
            (seriesName: string) => {
                const seriesConfig: IYAxisSeriesConfig = {
                    series: seriesName,
                };
                this.chartDef.axisMap.y.push(seriesConfig);
                return seriesConfig;
            },
            this.chartDef
        );
    }

    /**
     * Configure the y axis.
     */
    y2(): IYAxisConfigAPI {
        if (!this.chartDef.plotConfig.y2) {
            this.chartDef.plotConfig.y2 = {};
        }

        return new YAxisConfigAPI(
            "y2",
            this.chartDef.plotConfig.y2!,
            (seriesName: string) => {
                const seriesConfig: IYAxisSeriesConfig = {
                    series: seriesName,
                };
                this.chartDef.axisMap.y2.push(seriesConfig);
                return seriesConfig;
            },
            this.chartDef
        );
    }

    /**
     * Export an interactive web visualization of the chart.
     */
    async exportWeb(outputFolderPath: string, exportOptions?: IWebExportOptions): Promise<void> {

        const chartDef = this.serialize();
        if (exportOptions && exportOptions.showChartDef) {
            console.log("Expanded chart definition:");
            console.log(JSON.stringify(chartDef, null, 4));
        }

        const templatePath = exportOptions && exportOptions.template || await findChartTemplatePath();
        const overwrite = exportOptions && !!exportOptions.overwrite || false;

        const exportTemplateOptions: IExportOptions = {
            overwrite,
            inMemoryFiles: [
                {
                    file: "chart-def.json",
                    content: JSON.stringify(
                        { 
                            chartDef, 
                            options: {
                                makeStatic: false,
                                showChartDef: exportOptions && exportOptions.showChartDef || false,
                            },
                        }, 
                        null, 
                        4
                    ),
            },
            ],
        };

        await exportTemplate(templatePath, { chartDef }, outputFolderPath, exportTemplateOptions);

        if (exportOptions && exportOptions.openBrowser) {
            opn("file://" + path.resolve(path.join(outputFolderPath, "index.html")));
        }
    }

    /**
     * Serialize the plot definition so that it can be converted to JSON.
     * The JSON definition of the chart can be used to instantiate the chart in a browser.
     */
    serialize(): IChartDef {
        return applyDefaults(this.chartDef, this.plotDefaults); // Set missing default values after configuration by the fluent.
    }

    /**
     * Used to external detect the type of this object.
     */
    getTypeCode(): string {
        return "plot";
    }
}

/**
 * Fluent API for configuring the plot.
 */
export class PlotAPI extends AbstractPlotAPI {

    /**
     * Deserialize an instance of PlotAPI from a previously serialize chart def.
     * 
     * @param chartDef The chart definition to deserialize from.
     */
    static deserialize(chartDef: IChartDef): IPlotAPI {
        return new PlotAPI(chartDef.data, chartDef.plotConfig, chartDef.axisMap);
    }
    
    constructor(data: ISerializedDataFrame, plotConfig: IPlotConfig, axisMap: IAxisMap, plotDefaults?: IPlotConfig) {
        if (!isObject(data)) {
            throw new Error("Expected 'data' parameter to PlotAPI constructor to be a serialized dataframe.");
        }

        super(expandChartDef(data, plotConfig, axisMap), plotDefaults);
    }
}

/**
 * Fluent API for series configuration.
 */
abstract class AxisSeriesConfigAPI<FluentT, SeriesConfigT> extends AbstractPlotAPI implements IAxisSeriesConfigAPI {

    seriesName: string;
    seriesConfig: SeriesConfigT;

    constructor(
        seriesName: string,
        seriesConfig: SeriesConfigT,
        chartDef: IChartDef
    ) {
        super(chartDef);

        this.seriesName = seriesName;
        this.seriesConfig = seriesConfig;
    }
}

/**
 * Fluent API for X axis series configuration.
 */
class XAxisSeriesConfigAPI extends AxisSeriesConfigAPI<XAxisSeriesConfigAPI, IAxisSeriesConfig> implements IXAxisSeriesConfigAPI {

    constructor(
        seriesName: string,
        seriesConfig: IAxisSeriesConfig,
        chartDef: IChartDef
    ) {
        super(seriesName, seriesConfig, chartDef);
    }
}

/**
 * Fluent API for Y axis series configuration.
 */
class YAxisSeriesConfigAPI extends AxisSeriesConfigAPI<YAxisSeriesConfigAPI, IYAxisSeriesConfig> implements IYAxisSeriesConfigAPI {

    constructor(
        seriesName: string,
        seriesConfig: IYAxisSeriesConfig,
        chartDef: IChartDef
    ) {
        super(seriesName, seriesConfig, chartDef);
    }

    /**
     * Set the label for the series.
     */
    label(label: string): IYAxisSeriesConfigAPI  {
        this.seriesConfig.label = label;
        return this;
    }

    /**
     * Set the display format for values of this series.
     */
    format(formatString: string): IYAxisSeriesConfigAPI  {
        this.seriesConfig.format = formatString;
        return this;
    }

    /**
     * Configure an explicit x axis for this series.
     */
    setX(seriesName: string): IXAxisSeriesConfigAPI {
        if (!this.seriesConfig.x) {
            this.seriesConfig.x = { series: seriesName };
        }
        else {
            this.seriesConfig.x.series = seriesName;
        }

        return new XAxisSeriesConfigAPI(
            "x",
            this.seriesConfig.x!,
            this.chartDef
        );
    }
}

/**
 * Fluent API for configuring an axis of the chart.
 */
abstract class AxisConfigAPI<FluentT, AxisConfigT extends IAxisConfig> extends AbstractPlotAPI implements IAxisConfigAPI<FluentT> {

    /**
     * The name of the axis being configured.
     */
    protected axisName: string;

    /**
     * Configuration for the axis.
     */
    protected axisConfig: AxisConfigT;

    constructor(
        axisName: string,
        axisConfig: AxisConfigT,
        chartDef: IChartDef
    ) {
        super(chartDef);

        this.axisName = axisName;
        this.axisConfig = axisConfig;
    }

    /**
     * Set the label for the axis.
     */
    label(label: string): FluentT {

        if (!this.axisConfig.label) {
            this.axisConfig.label = {};
        }

        this.axisConfig.label.text = label;
        return this as any as FluentT;
    }

}

/**
 * Fluent API for configuring an axis of the chart.
 */
class XAxisConfigAPI extends AxisConfigAPI<IXAxisConfigAPI, IXAxisConfig> implements IXAxisConfigAPI {

    createSeriesConfig: (seriesName: string) => IAxisSeriesConfig;

    constructor(
        axisName: string,
        axisConfig: IXAxisConfig,
        createSeriesConfig: (seriesName: string) => IAxisSeriesConfig,
        chartDef: IChartDef
    ) {
        super(axisName, axisConfig, chartDef);

        this.createSeriesConfig = createSeriesConfig;
    }

    /**
     * Set the series for the x axis.
     */
    setSeries(seriesName: string): IXAxisSeriesConfigAPI {
        return new XAxisSeriesConfigAPI(
            seriesName,
            this.createSeriesConfig(seriesName),
            this.chartDef
        );
    }

    /**
     * Set the type of the axis.
     */
    type(axisType: AxisType): IXAxisSeriesConfigAPI {
        this.axisConfig.axisType = axisType;
        return this as any as IXAxisSeriesConfigAPI;
    }

    /**
     * Set the position for the label.
     */
    labelPosition(position: HorizontalLabelPosition): IXAxisConfigAPI {

        if (!this.axisConfig.label) {
            this.axisConfig.label = {};
        }

        this.axisConfig.label.position = position;
        return this;
    }
}

/**
 * Fluent API for configuring an axis of the chart.
 */
class YAxisConfigAPI extends AxisConfigAPI<IYAxisConfigAPI, IYAxisConfig> implements IYAxisConfigAPI {

    createSeriesConfig: (seriesName: string) => IYAxisSeriesConfig;

    constructor(
        axisName: string,
        axisConfig: IYAxisConfig,
        createSeriesConfig: (seriesName: string) => IYAxisSeriesConfig,
        chartDef: IChartDef
    ) {
        super(axisName, axisConfig, chartDef);

        this.createSeriesConfig = createSeriesConfig;
    }

    /**
     * Add a series to a Y axis.
     */
    addSeries(seriesName: string): IYAxisSeriesConfigAPI {
        
        return new YAxisSeriesConfigAPI(
            seriesName,
            this.createSeriesConfig(seriesName),
            this.chartDef
        );
    }

    /**
     * Set the position for the label.
     */
    labelPosition(position: VerticalLabelPosition): IYAxisConfigAPI {
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
     * Sets the minimum value to render on the axis.
     * @param value The minimum value to render.
     */
    min(value: number): IYAxisConfigAPI {
        // todo:
        return this;
    }

    /**
     * Sets the maximum value to render on the axis.
     * @param value The maximum value to render.
     */
    max(value: number): IYAxisConfigAPI {
        // todo:
        return this;
    }
    
}

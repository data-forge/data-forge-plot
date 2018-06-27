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

/**
 * Defines the configuration of an axis label.
 */
export interface IAxisLabelConfig {
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
    label?: string | IAxisLabelConfig; //TODO: would be good if got rid of these options. Would make it simpler.
}

/**
 * Configuration for a single series.
 */
export interface ISeriesConfig { 
    /**
     * The label for the series.
     */
    label?: string;

    /**
     * The format for the series.
     */
    format?: string;
}

/**
 * Configuration for all series.
 */
export interface ISeriesConfiguration {
    [index: string]: string | ISeriesConfig; //TODO: would be good if got rid of these options. Would make it simpler.
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
    series?: ISeriesConfiguration; //TODO: Consider moving this in with the axis configs above.
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
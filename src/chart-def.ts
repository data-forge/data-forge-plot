import { ISerializedDataFrame } from 'data-forge/build/lib/dataframe';
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
    label?: string | IAxisLabelConfig;
}

/**
 * Defines the chart.
 */
export interface IPlotConfig {

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
 * Relates a single axis to data series.
 */
export interface ISingleAxisMap {

    /**
     * The name of the series to render on the axis.
     */
    series: string;

    /**
     * The label for the series on this axis.
     */
    label?: string;

    /**
     * The format for rendering values of the series.
     */
    format?: string;

    /**
     * The color to render to assign to the series.
     */
    color?: string;
}

/**
 * Relates a single Y axis to data series.
 */
export interface ISingleYAxisMap extends ISingleAxisMap {
    /**
     * Configure a separate X axis for the y axis.
     */
    x?: string | ISingleAxisMap;
}

/**
 * Maps the columns in a dataframe to an axis in the chart.
 */
export interface IAxisMap {

    /**
     * The x axis for the chart.
     */
    x?: string | ISingleAxisMap;

    /**
     * The y axis for the chart.
     */
    y?: string | string[] | ISingleYAxisMap | ISingleYAxisMap[];

    /**
     * The optional  second y axis for the chart.
     */
    y2?: string | string[] | ISingleYAxisMap | ISingleYAxisMap[];
}

/**
 * Maps the columns in a dataframe to axis in the chart.
 */
export interface IExpandedAxisMap {

    /**
     * The default x axis for the chart.
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
 * A chart definition that is suitable for serialization to JSON and transfer to the browser via REST API.
 * Can be used to instantiate a Data-Forge chart in the browser.
 */
export interface IChartDef {

    /**
     * JSON serializable representation of the data.
     */
    data: ISerializedDataFrame;

    /**
     * Defines the look of the chart.
     */
    plotDef: IPlotConfig;

    /**
     * Maps fields in the data to axis' on the chart.
     */
    axisMap: IExpandedAxisMap;
}

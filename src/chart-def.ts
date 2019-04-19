
import { ISerializedDataFrame } from "@data-forge/serialization";
import { HorizontalLabelPosition, VerticalLabelPosition, AxisType, ChartType } from "@data-forge-plot/chart-def";

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
 * Configures a Y axis of the chart.
 */
export interface IYAxisConfig extends IAxisConfig {
    
    /**
     * The minimum value to render on the axis.
     */
    min?: number;

    /**
     * The maximum value to render on the axis.
     */
    max?: number;
}

/**
 * Configures the legend of the chart.
 */
export interface ILegendConfig {

    /**
     * Set to true (default) to show the legend for the chart   .
     */
    show?: boolean;
}

/**
 * Defines the chart.
 */
export interface IPlotConfig {

    /**
     * The type of chart to render.
     * Default to "line".
     */
    chartType?: ChartType;

    /**
     * Width of the plot.
     * Default to 800.
     */
    width?: number | string;

    /**
     * Height of the plot.
     * Default to 600.
     */
    height?: number | string;

    /**
     * Configuration for the x axis.
     */
    x?: IAxisConfig;

    /**
     * Configuration for the y axis.
     */
    y?: IYAxisConfig;

    /**
     * Configuration for the second y axis.
     */
    y2?: IYAxisConfig;

    /**
     * Configures the chart's legend.
     */
    legend?: ILegendConfig;
}

/**
 * Relates a single axis to data series.
 */
export interface IAxisSeriesConfig {

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
export interface IYAxisSeriesConfig extends IAxisSeriesConfig {
    /**
     * Configure a separate X axis for the y axis.
     */
    x?: string | IAxisSeriesConfig;
}

/**
 * Maps the columns in a dataframe to an axis in the chart.
 */
export interface IAxisMap {

    /**
     * The x axis for the chart.
     */
    x?: string | IAxisSeriesConfig;

    /**
     * The y axis for the chart.
     */
    y?: string | string[] | IYAxisSeriesConfig | IYAxisSeriesConfig[];

    /**
     * The optional  second y axis for the chart.
     */
    y2?: string | string[] | IYAxisSeriesConfig | IYAxisSeriesConfig[];
}

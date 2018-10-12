import { IChartDef, ISingleYAxisMap, ISingleAxisMap, IAxisConfig } from "../../../src/chart-def";

declare var moment: any;
declare var numeral: any;

/**
 * Configure a single axe.
 */
function configureOneAxe(axisName: string, inputChartDef: IChartDef, c3Axes: any) {
    const axisMap = inputChartDef.axisMap as any;
    if (!axisMap) {
        return;
    }

    const series: ISingleYAxisMap[] = axisMap[axisName];
    if (!series) {
        return;
    }

    for (const seriesConfig of series) {
        c3Axes[seriesConfig.series] = axisName;
    }
}

/**
 * Configure C3 axes.
 */
function configureAxes(inputChartDef: IChartDef): any { // todo: I could type the c3 chart def?
    const c3Axes: any = {};
    configureOneAxe("y", inputChartDef, c3Axes);
    configureOneAxe("y2", inputChartDef, c3Axes);
    return c3Axes;
}

/**
 * Determine the default axis type based on data type.
 * TODO: This code could be simplified by removing this function. This should be choosen server-side!
 */
function determineAxisType(dataType: string): string { // todo: return val could be an enum.
    if (dataType === "number") {
        return "indexed";
    }
    else if (dataType === "date") {
        return "timeseries";
    }
    else {
        return "category";
    }
}

/**
 * Format values for display.
 */
function formatValues(
    inputChartDef: IChartDef,
    seriesName: string,
    dataType: string,
    formatString: string
): string[] | undefined {
    if (dataType === "number") { // Use numeral to format numbers.
        return inputChartDef.data.values.map(value => numeral(value[seriesName]).format(formatString));
    }
    else if (dataType === "date") { // Use moment for date formating.
        return inputChartDef.data.values.map(value => moment(value[seriesName]).format(formatString));
    }
    else {
        return undefined;
    }
}

function configureOneSeries(
    seriesConfig: ISingleAxisMap,
    inputChartDef: IChartDef,
    axisDef: IAxisConfig,
    c3AxisDef: any
): void {
    // Default axis type based on data type.
    const seriesName = seriesConfig.series;
    const dataType = inputChartDef.data.columns[seriesName];
    c3AxisDef.type = determineAxisType(dataType);

    if (axisDef) {
        if (axisDef.axisType && axisDef.axisType !== "default") {
            c3AxisDef.type = axisDef.axisType;
        }

        if (axisDef.label) {
            c3AxisDef.label = axisDef.label;
        }
    }

    c3AxisDef.show = true;

    if (seriesConfig.format) {
        if (!c3AxisDef.tick) {
            c3AxisDef.tick = {};
        }

        c3AxisDef.tick.values = formatValues(inputChartDef, seriesName, dataType, seriesConfig.format);
    }
}

/**
 * Configure a single axis.
 */
function configureOneAxis(axisName: string, inputChartDef: IChartDef, c3Axis: any): void {
    const axisMap = inputChartDef.axisMap as any;
    if (!axisMap) {
        return;
    }

    c3Axis[axisName] = { show: false };

    const axisDef: IAxisConfig = (inputChartDef.plotConfig as any)[axisName];
    const c3AxisDef = c3Axis[axisName];

    const series: ISingleAxisMap = axisMap[axisName];
    if (!series) {
        return;
    }

    if (Array.isArray(series)) {
        series.forEach(seriesConfig => {
            configureOneSeries(seriesConfig, inputChartDef, axisDef, c3AxisDef);
        });
    }
    else {
        configureOneSeries(series, inputChartDef, axisDef, c3AxisDef);
    }
}

/**
 * Configure C3 axis'.
 */
function configureAxis(inputChartDef: IChartDef): any {
    const c3Axis: any = {};

    configureOneAxis("x", inputChartDef, c3Axis);
    configureOneAxis("y", inputChartDef, c3Axis);
    configureOneAxis("y2", inputChartDef, c3Axis);

    return c3Axis;
}

/**
 * Configure the names of series.
 */
function configureSeriesNames(inputChartDef: IChartDef): any {
    const seriesNames: any = {};

    if (inputChartDef.axisMap) {
        for (const axisName in inputChartDef.axisMap) {
            const series: ISingleAxisMap = (inputChartDef.axisMap as any)[axisName];
            if (Array.isArray(series)) {
                series.forEach(seriesConfig => {
                    if (seriesConfig.label) {
                        seriesNames[seriesConfig.series] = seriesConfig.label;
                    }
                });
            }
            else {
                if (series.label) {
                    seriesNames[series.series] = series.label;
                }
            }
        }
    }

    return seriesNames;
}

/**
 * Extract x axis series for y axis series.
 */
function extractXS(axisName: string, inputChartDef: IChartDef, xs: any): void {
    const axisMap = inputChartDef.axisMap as any;
    if (!axisMap) {
        return;
    }

    const series: ISingleYAxisMap[] = axisMap[axisName];
    if (!series) {
        return;
    }

    for (const seriesConfig of series) {
        const ySeriesName = seriesConfig.series;
        if (xs[ySeriesName]) {
            return; // Already set.
        }

        if (seriesConfig.x) {
            xs[ySeriesName] = (seriesConfig.x as ISingleAxisMap).series; // X explicitly associated with Y.
        }
        else if (inputChartDef.axisMap && inputChartDef.axisMap.x) {
            xs[ySeriesName] = inputChartDef.axisMap.x.series; // Default X.
        }
    }
}

function addColumn(seriesName: string, inputChartDef: IChartDef, columns: any[], columnsSet: any): void {
    if (columnsSet[seriesName]) {
        return; // Already set.
    }

    const columnData = inputChartDef.data.values.map(row => row[seriesName]);

    columnsSet[seriesName] = true;
    columns.push([seriesName].concat(columnData));
}

/**
 * Extract column data.
 */
function extractColumns(axisName: string, inputChartDef: IChartDef, columns: any[], columnsSet: any): void {
    const axisMap = inputChartDef.axisMap as any;
    if (!axisMap) {
        return;
    }

    const series: ISingleYAxisMap[] = axisMap[axisName];
    if (!series) {
        return;
    }

    for (const seriesConfig of series) {
        addColumn(seriesConfig.series, inputChartDef, columns, columnsSet);

        const xSeriesName = seriesConfig.x && (seriesConfig.x as ISingleAxisMap).series
            || inputChartDef.axisMap && inputChartDef.axisMap.x && inputChartDef.axisMap.x.series || null;
        if (xSeriesName) {
            addColumn(xSeriesName, inputChartDef, columns, columnsSet);
        }
    }
}

/**
 * Convert a data-forge-plot chart definition to a C3 chart definition.
 */
export function formatChartDef(inputChartDef: IChartDef): any {

    //
    // WORKAROUND: Merge the index in as a column.
    // This needs to be changed later and it shouldn't be part of the C3 template it should be
    // code that is shared to all templates.
    //
    let workingChartDef = inputChartDef;

    if (inputChartDef.data.index && inputChartDef.data.index.values && inputChartDef.data.index.values.length > 0) {
        workingChartDef = Object.assign({}, inputChartDef);
        workingChartDef.data = Object.assign({}, inputChartDef.data);
        workingChartDef.data.columnOrder = inputChartDef.data.columnOrder.slice(); // Clone array.
        workingChartDef.data.columnOrder.push("__index__");
        workingChartDef.data.columns = Object.assign({}, inputChartDef.data.columns);
        workingChartDef.data.columns["__index__"] = inputChartDef.data.index.type;
        workingChartDef.data.values = inputChartDef.data.values.slice(); // Clone array.
        for (let i = 0; i < workingChartDef.data.values.length; ++i) {
            const row = workingChartDef.data.values[i];
            row["__index__"] = inputChartDef.data.index.values[i];
        }
    }

    let values = workingChartDef.data.values;

    if (workingChartDef.data.columns) {
        const columnNames = Object.keys(workingChartDef.data.columns);
        const hasDates = columnNames.filter(columnName => workingChartDef.data.columns[columnName] === "date");
        if (hasDates) { // todo: this should be done by the plot api somehow!! The template should do minimal work.
            values = values.slice(); // Clone the date so we can inflate the dates.
            for (const columnName of columnNames) {
                if (workingChartDef.data.columns[columnName] === "date") { // This column is a date.
                    for (const row of values) {
                        row[columnName] = moment(row[columnName], moment.ISO_8601).toDate();
                    }
                }
            }
        }
    }

    const xs: any = {};
    extractXS("y", workingChartDef, xs);
    extractXS("y2", workingChartDef, xs);

    const columns: any[] = [];
    const columnsSet: any = {};
    extractColumns("y", workingChartDef, columns, columnsSet);
    extractColumns("y2", workingChartDef, columns, columnsSet);

    const c3ChartDef = {
        bindto: "#chart",
        size: {
            width: workingChartDef.plotConfig && workingChartDef.plotConfig.width || 1200,
            height: workingChartDef.plotConfig && workingChartDef.plotConfig.height || 600,
        },
        data: {
            xs,
            columns,
            type: workingChartDef.plotConfig && workingChartDef.plotConfig.chartType || "line",
            axes: configureAxes(workingChartDef),
            names: configureSeriesNames(workingChartDef),
        },
        axis: configureAxis(workingChartDef),
        transition: {
            duration: 0 // Disable animated transitions when we are capturing a static image.
        },
        point: {
            show: false
        }
    };

    return c3ChartDef;
}

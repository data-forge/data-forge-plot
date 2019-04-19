import "jest";
import { expandChartDef, expandAxisConfig, expandAxisMap, expandSeriesConfig, expandYSeriesConfig, expandYSeriesConfigArray } from "../expand-chart-def";
import { ChartType, AxisType } from "@data-forge-plot/chart-def";

describe("expand chart def", () => {

    it("axis label string is expended to an object", () => {
        const expanded = expandAxisConfig({ label: "My label" });
        expect(expanded.label!.text).toBe("My label");
    });

    it("can expand string series config to object", () => {
        const expanded = expandSeriesConfig("my series");
        expect(expanded.series).toBe("my series");
    });

    it("can clone object series config", () => {
        const seriesConfig = { series: "my series" };
        const expanded = expandSeriesConfig(seriesConfig);
        expect(expanded).not.toBe(seriesConfig);
        expect(expanded).toEqual(seriesConfig);
    });    

    it("can expand y series config with specific x series as string", () => {
        const seriesConfig = { series: "my y series", x: "my x series" };
        const expanded = expandYSeriesConfig(seriesConfig);
        expect(expanded.x!.series).toBe("my x series");
    });

    it("can expand undefined y series to empty array", () => {
        const expanded = expandYSeriesConfigArray();
        expect(expanded).toEqual([]);
    });

    it("can expand empty y series to empty array", () => {
        const expanded = expandYSeriesConfigArray([]);
        expect(expanded).toEqual([]);
    });

    it("can expand string y series to array", () => {
        const expanded = expandYSeriesConfigArray("my series");
        expect(expanded).toEqual([
            {
                series: "my series",
            },
        ]);
    });

    it("can expand object y series to array", () => {
        const expanded = expandYSeriesConfigArray({ series: "my series" });
        expect(expanded).toEqual([
            {
                series: "my series",
            },
        ]);
    });

    it("can expand string array y series to array", () => {
        const expanded = expandYSeriesConfigArray(["s1", "s2"]);
        expect(expanded).toEqual([
            {
                series: "s1",
            },
            {
                series: "s2",
            },
        ]);
    });

    it("can expand object array y series to array", () => {
        const expanded = expandYSeriesConfigArray([{ series: "s1" }, { series: "s2" }]);
        expect(expanded).toEqual([
            {
                series: "s1",
            },
            {
                series: "s2",
            },
        ]);
    });

    it("can expand empty axis map", () => {
        const expanded = expandAxisMap({}, []);
        expect(expanded).toEqual({
            y: [],
            y2: [],
        });
    });

    it("can expand empty axis map 2", () => {
        const expanded = expandAxisMap({ y: [], y2: [] }, []);
        expect(expanded).toEqual({
            y: [],
            y2: [],
        });
    });

    it("can expand axis map with strings", () => {
        const expanded = expandAxisMap({ x: "my x", y: "my y1", y2: "my y2" }, []);
        expect(expanded).toEqual({
            x: {
                series: "my x",
            },
            y: [
                {
                    series: "my y1",
                },
            ],
            y2: [
                {
                    series: "my y2",
                },
            ],
        });
    });

    it("y does not default when y is specified", () => {

        const data: any = { columnOrder: ["a", "b", "c"] };
        const plotConfig: any = {};
        const axisMap: any = { y: "b" };
        const chartDef = expandChartDef(data, plotConfig, axisMap);
        expect(chartDef.axisMap.y).toEqual([
            {
                series: "b",
            },
        ]);
        expect(chartDef.axisMap.y2).toEqual([]);
    });

    it("y does not default when y2 is specified", () => {

        const data: any = { columnOrder: ["a", "b", "c"] };
        const plotConfig: any = {};
        const axisMap: any = { y2: "b" };
        const chartDef = expandChartDef(data, plotConfig, axisMap);
        expect(chartDef.axisMap.y).toEqual([]);
        expect(chartDef.axisMap.y2).toEqual([
            {
                series: "b",
            },
        ]);
    });

    it("can set chart type", () => {
        const data: any = {};
        const plotConfig: any = { chartType: ChartType.Donut };
        const axisMap: any = {};
        const chartDef = expandChartDef(data, plotConfig, axisMap);
        expect(chartDef.plotConfig.chartType).toBe(ChartType.Donut);
    });

    it("can set width and height", () => {
        
        const data: any = {};
        const plotConfig: any = { width: 5555, height: 6666 };
        const axisMap: any = {};
        const chartDef = expandChartDef(data, plotConfig, axisMap);
        expect(chartDef.plotConfig.width).toBe(5555);
        expect(chartDef.plotConfig.height).toBe(6666);
    });

    it("can expand axis config", () => {

        const xConfig = { axisType: AxisType.Category };
        const yConfig = { axisType: AxisType.Indexed };
        const y2Config = { axisType: AxisType.Timeseries };
        const expanded = expandChartDef({} as any, { x: xConfig, y: yConfig, y2: y2Config }, {});
        expect(expanded.plotConfig.x).not.toBe(xConfig);
        expect(expanded.plotConfig.x).toEqual(xConfig);
        expect(expanded.plotConfig.y).not.toBe(yConfig);
        expect(expanded.plotConfig.y).toEqual(yConfig);
        expect(expanded.plotConfig.y2).not.toBe(y2Config);
        expect(expanded.plotConfig.y2).toEqual(y2Config);
    });

    it("can expand axis map", () => {

        const expanded = expandChartDef({} as any, {}, { x: "my x", y: "my y", y2: "my y2" });
        expect(expanded.axisMap.x).toEqual({ series: "my x" });
        expect(expanded.axisMap.y).toEqual([{ series: "my y" }]);
        expect(expanded.axisMap.y2).toEqual([{ series: "my y2" }]);
    });
});

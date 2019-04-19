import "jest";
import { applyDefaults } from "../apply-defaults";
import { ChartType } from "@data-forge-plot/chart-def";

describe("apply defaults", () => {

    it("chart type defaults to line 1", () => {
        const inputChartDef: any = { data: { columnOrder: [], }, plotConfig: {} };
        const expanded = applyDefaults(inputChartDef);
        expect(expanded.plotConfig!.chartType!).toEqual(ChartType.Line);
    });

    it("chart type defaults to line 2", () => {
        const inputChartDef: any = { data: { columnOrder: [], }, plotConfig: {} };
        const expanded = applyDefaults(inputChartDef);
        expect(expanded.plotConfig!.chartType!).toEqual(ChartType.Line);
    });

    it("width defaults to 800", () => {
        const inputChartDef: any = { data: { columnOrder: [], }, plotConfig: {} };
        const expanded = applyDefaults(inputChartDef);
        expect(expanded.plotConfig!.width).toEqual(800);
    });

    it("height defaults to 600", () => {
        const inputChartDef: any = { data: { columnOrder: [], }, plotConfig: {} };
        const expanded = applyDefaults(inputChartDef);
        expect(expanded.plotConfig!.height).toEqual(600);
    });

    it("y axis defaults to all columns when no y axis series is specified 1", () => {

        const data: any = { columnOrder: ["a", "b", "c"] };
        const plotConfig: any = {};
        const axisMap: any = {};
        const inputChartDef: any = { data, plotConfig, axisMap };
        const expanded = applyDefaults(inputChartDef);
        expect(expanded.axisMap.y).toEqual([
            {
                series: "a",
            },
            {
                series: "b",
            },
            {
                series: "c",
            },
        ]);
        expect(expanded.axisMap.y2).toEqual([]);
    });

    it("y axis defaults to all columns when no y axis series is specified 2", () => {

        const data: any = { columnOrder: ["a", "b", "c"] };
        const plotConfig: any = {};
        const axisMap: any = { y: [], y2: [] };
        const inputChartDef: any = { data, plotConfig, axisMap };
        const expanded = applyDefaults(inputChartDef);
        expect(expanded.axisMap.y).toEqual([
            {
                series: "a",
            },
            {
                series: "b",
            },
            {
                series: "c",
            },
        ]);
        expect(expanded.axisMap.y2).toEqual([]);
    });
});

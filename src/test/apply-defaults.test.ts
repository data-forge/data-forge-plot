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

    it("can set plot defaults 1", () => {
        const inputChartDef: any = { data: { columnOrder: [], } };
        const expanded = applyDefaults(inputChartDef, { chartType: ChartType.Bubble });
        expect(expanded.plotConfig!.chartType!).toEqual(ChartType.Bubble);
    });

    it("can set plot defaults 2", () => {
        const inputChartDef: any = { data: { columnOrder: [], }, plotConfig: {} };
        const expanded = applyDefaults(inputChartDef, { chartType: ChartType.Bubble });
        expect(expanded.plotConfig!.chartType!).toEqual(ChartType.Bubble);
    });

    const testData = {
        columnOrder: ["a", "b"],
        columns: {
            a: "number",
            b: "number",
        },
        index: {
            type: "number",
            values: [2, 3, 4],
        },
        values: [
            {
                a: 10,
                b: 100,
            },
            {
                a: 20,
                b: 200,
            },
            {
                a: 30,
                b: 300,
            },
        ],
    };

    const testDataWithBadValues = {
        columnOrder: ["a", "b"],
        columns: {
            a: "number",
            b: "number",
        },
        index: {
            type: "number",
            values: [2, 3, 4, 5, 6],
        },
        values: [
            {
                a: 10,
                b: 100,
            },
            {
                a: null,
                b: undefined,
            },
            {
                a: 20,
                b: 200,
            },
            {
                a: 5 / 0,
                b: Math.sqrt(-2),
            },
            {
                a: 30,
                b: 300,
            },
        ],
    };

    it("y min can be passed through", () => {

        const inputChartDef: any = {
            data: testData,
            plotConfig: {
                y: {
                    min: 15,
                },
            },
        };

        const chartDef = applyDefaults(inputChartDef);
        expect(chartDef.plotConfig.y!.min).toBe(15);
    });

    it("y min defaults to y series min", () => {

        const inputChartDef: any = {
            data: testData,
            plotConfig: {
                y: {
                },
                y2: {
                },
            },
            axisMap: {
                y: [
                    {
                        series: "a",
                    },
                    {
                        series: "b",
                    },
                ],
            },
        };

        const chartDef = applyDefaults(inputChartDef);
        expect(chartDef.plotConfig.y!.min).toBe(10);
    });

    it("y min defaults to y series min with bad values", () => {

        const inputChartDef: any = {
            data: testDataWithBadValues,
            plotConfig: {
                y: {
                },
                y2: {
                },
            },
            axisMap: {
                y: [
                    {
                        series: "a",
                    },
                    {
                        series: "b",
                    },
                ],
            },
        };

        const chartDef = applyDefaults(inputChartDef);
        expect(chartDef.plotConfig.y!.min).toBe(10);
    });

    it("y max can be passed through", () => {

        const inputChartDef: any = {
            data: testData,
            plotConfig: {
                y: {
                    max: 25,
                },
            },
        };

        const chartDef = applyDefaults(inputChartDef);
        expect(chartDef.plotConfig.y!.max).toBe(25);
    });

    it("y max defaults to y series max", () => {

        const inputChartDef: any = {
            data: testData,
            plotConfig: {
                y: {
                },
                y2: {
                },
            },
            axisMap: {
                y: [
                    {
                        series: "a",
                    },
                    {
                        series: "b",
                    },
                ],
            },
        };

        const chartDef = applyDefaults(inputChartDef);
        expect(chartDef.plotConfig.y!.max).toBe(300);
    });

    it("y max defaults to y series max with bad values", () => {

        const inputChartDef: any = {
            data: testDataWithBadValues,
            plotConfig: {
                y: {
                },
                y2: {
                },
            },
            axisMap: {
                y: [
                    {
                        series: "a",
                    },
                    {
                        series: "b",
                    },
                ],
            },
        };

        const chartDef = applyDefaults(inputChartDef);
        expect(chartDef.plotConfig.y!.max).toBe(300);
    });

    it("y2 min can be passed through", () => {

        const inputChartDef: any = {
            data: testData,
            plotConfig: {
                y2: {
                    min: 0,
                },
            },
        };

        const chartDef = applyDefaults(inputChartDef);
        expect(chartDef.plotConfig.y2!.min).toBe(0);
    });

    it("y2 min defaults to y2 series min", () => {

        const inputChartDef: any = {
            data: testData,
            plotConfig: {
                y: {
                },
                y2: {
                },
            },
            axisMap: {
                y2: [
                    {   
                        series: "a",
                    },
                    {
                        series: "b",
                    },
                ],
            },
        };

        const chartDef = applyDefaults(inputChartDef);
        expect(chartDef.plotConfig.y2!.min).toBe(10);
    });

    it("y2 min defaults to y2 series min with bad values", () => {

        const inputChartDef: any = {
            data: testDataWithBadValues,
            plotConfig: {
                y: {
                },
                y2: {
                },
            },
            axisMap: {
                y2: [
                    {   
                        series: "a",
                    },
                    {
                        series: "b",
                    },
                ],
            },
        };

        const chartDef = applyDefaults(inputChartDef);
        expect(chartDef.plotConfig.y2!.min).toBe(10);
    });

    it("y2 max can be passed through", () => {

        const inputChartDef: any = {
            data: testData,
            plotConfig: {
                y2: {
                    max: 400,
                },
            },
        };

        const chartDef = applyDefaults(inputChartDef);
        expect(chartDef.plotConfig.y2!.max).toBe(400);
    });

    it("y2 max defaults to y2 series max", () => {

        const inputChartDef: any = {
            data: testData,
            plotConfig: {
                y: {
                },
                y2: {
                },
            },
            axisMap: {
                y2: [
                    {
                        series: "a",
                    },
                    {
                        series: "b",
                    },
                ],
            },
        };

        const chartDef = applyDefaults(inputChartDef);
        expect(chartDef.plotConfig.y2!.max).toBe(300);
    });

    it("y2 max defaults to y2 series max with bad values", () => {

        const inputChartDef: any = {
            data: testDataWithBadValues,
            plotConfig: {
                y: {
                },
                y2: {
                },
            },
            axisMap: {
                y2: [
                    {
                        series: "a",
                    },
                    {
                        series: "b",
                    },
                ],
            },
        };

        const chartDef = applyDefaults(inputChartDef);
        expect(chartDef.plotConfig.y2!.max).toBe(300);
    });

    it("min/max not computed for non number data", () => {

        const data = {
            columnOrder: ["a", "b"],
            columns: {
                a: "string",
                b: "string",
            },
            index: {
                type: "number",
                values: [2, 3, 4],
            },
            values: [
                {
                    a: "10",
                    b: "100",
                },
                {
                    a: "20",
                    b: "200",
                },
                {
                    a: "30",
                    b: "300",
                },
            ],
        };
    
        const inputChartDef: any = {
            data,
            plotConfig: {
                y: {
                },
                y2: {
                },
            },
            axisMap: {
                y: [
                    {
                        series: "a",
                    },
                    {
                        series: "b",
                    },
                ],
            },
        };

        const chartDef = applyDefaults(inputChartDef);
        expect(chartDef.plotConfig.y!.min).toBeUndefined();
        expect(chartDef.plotConfig.y!.max).toBeUndefined();
        expect(chartDef.plotConfig.y2!.min).toBeUndefined();
        expect(chartDef.plotConfig.y2!.max).toBeUndefined();
    });    

    it("computed min and max are rounded", () => {

        const testData = {
            columnOrder: [ "a" ],
            columns: {
                a: "number",
                b: "number",
            },
            index: {
                type: "number",
                values: [2, 3, 4],
            },
            values: [
                {
                    a: 10.123456,
                },
                {
                    a: 20,
                },
                {
                    a: 30.01234567,
                },
            ],
        };
    
        const inputChartDef: any = {
            data: testData,
            plotConfig: {
                y: {
                },
                y2: {
                },
            },
            axisMap: {
                y: [
                    {
                        series: "a",
                    },
                    {
                        series: "b",
                    },
                ],
            },
        };

        const chartDef = applyDefaults(inputChartDef);
        expect(chartDef.plotConfig.y!.min).toBe(10.12);
        expect(chartDef.plotConfig.y!.max).toBe(30.02);
    });

});

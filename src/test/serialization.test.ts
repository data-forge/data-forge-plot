import { expect } from "chai";
import "mocha";
import { DataFrame } from "data-forge";
import "../index";
import { PlotAPI } from "../plot-api";
import { IChartDef, ChartType, AxisType } from "../chart-def";

describe("serialization", () => {

    const exampleData = {
        columnOrder: [
            "A",
            "__index__",
        ],
        columns: {
            A: "number",
            __index__: "number",
        },
        index: {
            type: "number",
            values: [ 1, 2, 3 ],
        },
        values: [
            {
                A: 10,
                __index__: 1,
            },
            {
                A: 20,
                __index__: 2,
            },
            {
                A: 30,
                __index__: 3,
            },
        ],
    };

    it("can deserialize and then serialize a chart def", ()  => {

        const chartDef: IChartDef = {
            data: exampleData,
            plotConfig: {
                chartType: ChartType.Line,
                width: 800,
                height: 600,
                template: "c3",
                x: {
                    axisType: AxisType.Default,
                    label: {},
                },
                y: {
                    axisType: AxisType.Default,
                    label: {},
                },
                y2: {
                    axisType: AxisType.Default,
                    label: {},
                },
                legend: {
                    show: true,
                },
            },
            axisMap: {
                x: {
                    series: "__index__",
                },
                y: [
                    {
                        series: "A",
                    },
                ],
                y2: [],
            },
        };

        const plot = PlotAPI.deserialize(chartDef);
        const serialized = plot.serialize();
        expect(serialized).to.eql(chartDef);
    });

    it("serialization defaults legend show 1", () => {
        const plot = new PlotAPI(exampleData, {}, true, {});
        const serialized = plot.serialize();
        expect(serialized.plotConfig.legend.show).to.eql(true);
    });

    it("serialization defaults legend show 2", () => {
        const plot = new PlotAPI(exampleData, { legend: {} }, false, {});
        const serialized = plot.serialize();
        expect(serialized.plotConfig.legend.show).to.eql(false);
    });

    it("serialization preserves legend show", () => {
        const plot = new PlotAPI(exampleData, { legend: { show: false }}, true, {});
        const serialized = plot.serialize();
        expect(serialized.plotConfig.legend.show).to.eql(false);
    });

    
});

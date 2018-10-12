import { expect } from "chai";
import "mocha";
import { Series } from "data-forge";
import "../index";

describe("data-forge-plot - series", () => {

    it("plot series with no configuration", ()  => {

        const series = new Series({ index: [1, 2, 3], values: [10, 20, 30] });
        const plotAPI = series.plot();
        expect(plotAPI.serialize()).to.eql({
            data: {
                columnOrder: [
                    "__value__",
                    "__index__"
                ],
                columns: {
                    __value__: "number",
                    __index__: "number"
                },
                index: {
                    type: "number",
                    values: [ 1, 2, 3 ],
                },
                values: [
                    {
                        __value__: 10,
                        __index__: 1
                    },
                    {
                        __value__: 20,
                        __index__: 2
                    },
                    {
                        __value__: 30,
                        __index__: 3
                    }
                ]
            },
            plotConfig: {
                chartType: "line",
                width: 800,
                height: 600,
                template: "c3",
                x: {
                    axisType: "default",
                    label: {}
                },
                y: {
                    axisType: "default",
                    label: {}
                },
                y2: {
                    axisType: "default",
                    label: {}
                }
            },
            axisMap: {
                x: {
                    series: "__index__"
                },
                y: [
                    {
                        series: "__value__"
                    }
                ],
                y2: []
            }
        });
    });

    it("can set template", ()  => {

        const series = new Series({ index: [ 1 ], values: [ 10 ] });
        const plotAPI = series.plot()
            .template("smig");

        expect(plotAPI.serialize()).to.eql({
            data: {
                columnOrder: [
                    "__value__",
                    "__index__"
                ],
                columns: {
                    __value__: "number",
                    __index__: "number"
                },
                index: {
                    type: "number",
                    values: [ 1 ],
                },
                values: [
                    {
                        __value__: 10,
                        __index__: 1
                    }
                ]
            },
            plotConfig: {
                chartType: "line",
                width: 800,
                height: 600,
                template: "smig",
                x: {
                    axisType: "default",
                    label: {}
                },
                y: {
                    axisType: "default",
                    label: {}
                },
                y2: {
                    axisType: "default",
                    label: {}
                }
            },
            axisMap: {
                x: {
                    series: "__index__"
                },
                y: [
                    {
                        series: "__value__"
                    }
                ],
                y2: []
            }
        });
    });

});

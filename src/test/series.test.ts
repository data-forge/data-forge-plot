import "jest";
import { Series } from "data-forge";
import "../index";

describe("data-forge-plot - series", () => {

    it("plot series with no configuration", ()  => {

        const series = new Series({ index: [1, 2, 3], values: [10, 20, 30] });
        const plotAPI = series.plot();
        expect(plotAPI.serialize()).toEqual({
            data: {
                columnOrder: [
                    "__value__",
                ],
                columns: {
                    __value__: "number",
                },
                index: {
                    type: "number",
                    values: [ 1, 2, 3 ],
                },
                values: [
                    {
                        __value__: 10,
                    },
                    {
                        __value__: 20,
                    },
                    {
                        __value__: 30,
                    }
                ]
            },
            plotConfig: {
                chartType: "line",
                width: 800,
                height: 600,
            },
            axisMap: {
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

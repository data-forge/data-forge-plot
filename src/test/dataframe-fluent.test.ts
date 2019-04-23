import "jest";
import { DataFrame } from "data-forge";
import "../index";

describe("data-forge-plot - dataframe fluent", () => {

    it("can explicity set y axis", ()  => {

        const df = new DataFrame({ index: [1, 2, 3], values: [{ A: 10, }, { A: 20 }, { A: 30 } ] });
        const plotAPI = df.plot()
            .y()
                .addSeries("A");

        expect(plotAPI.serialize()).toEqual({
            data: {
                columnOrder: [
                    "A",
                ],
                columns: {
                    A: "number",
                },
                index: {
                    type: "number",
                    values: [ 1, 2, 3 ],
                },
                values: [
                    {
                        A: 10,
                    },
                    {
                        A: 20,
                    },
                    {
                        A: 30,
                    },
                ],
            },
            plotConfig: {
                chartType: "line",
                width: 800,
                height: 600,
                y: {
                    min: 10,
                    max: 30,
                },
                y2: {
                },
            },
            axisMap: {
                y: [
                    {
                        series: "A",
                    },
                ],
                y2: [],
            },
        });
    });

});

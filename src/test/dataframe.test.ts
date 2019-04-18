import "jest";
import { DataFrame } from "data-forge";
import "../index";

describe("data-forge-plot - dataframe configuration", () => {

    it("plot dataframe with no configuration", ()  => {

        const df = new DataFrame({ index: [1, 2, 3], values: [{ A: 10 }, { A: 20 }, { A: 30 } ] });
        const plotAPI = df.plot();
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

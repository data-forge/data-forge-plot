import "jest";
import { DataFrame } from "data-forge";
import "../index";
import { ChartType } from "@data-forge-plot/chart-def";

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
                width: 800,
                height: 600,
                y: {
                    min: 10,
                    max: 30,
                },
                y2: {
                },
                legend: {
                    show: true,
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

    it("legend is enabled by default for dataframe", ()  => {

        const df = new DataFrame();
        const plotAPI = df.plot();
        const serialized = plotAPI.serialize();
        expect(serialized.plotConfig.legend!.show).toEqual(true);
    });
});

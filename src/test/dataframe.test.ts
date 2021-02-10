import "jest";
import { DataFrame } from "data-forge";
import "../index";

describe("data-forge-plot - dataframe configuration", () => {

    it("plot dataframe with no configuration", ()  => {

        const df = new DataFrame({ index: [1, 2, 3], values: [{ A: 10 }, { A: 20 }, { A: 30 } ] });
        const plotAPI = df.plot();
        expect(plotAPI.serialize()).toEqual({
            "data": {
                "series": {
                    "A": {
                        "type": "number",
                        "values": [
                            10,
                            20,
                            30
                        ]
                    }
                }
            },
            "plotConfig": {
                "legend": {
                    "show": true
                },
                "chartType": "line",
                "width": 800,
                "height": 600,
                "y": {
                    "min": 10,
                    "max": 30
                },
                "y2": {}
            },
            "axisMap": {
                "y": [
                    {
                        "series": "A"
                    }
                ],
                "y2": []
            }
        });
    });
});

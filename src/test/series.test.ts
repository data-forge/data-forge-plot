import "jest";
import { Series } from "data-forge";
import "../index";

describe("data-forge-plot - series", () => {

    it("plot series with no configuration", ()  => {
        const series = new Series({ index: [1, 2, 3], values: [10, 20, 30] });
        const plotAPI = series.plot();
        expect(plotAPI.serialize()).toEqual({
            "data": {
                "series": {
                    "y": {
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
                    "show": false
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
                        "series": "y"
                    }
                ],
                "y2": []
            }
        });
    });
});

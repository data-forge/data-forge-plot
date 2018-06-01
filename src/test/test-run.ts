import { DataFrame, Series } from "data-forge";
import "../index";
import { ChartType } from "../index";

async function main(): Promise<void> {
    /*
    var series = new Series([10, 20, 15, 18, 25, 22, 13 ]);
    await series.plot().renderImage("./test-series.png");
    */

    
    var df = new DataFrame([ 
        {
            A: 10,
        },
        {
            A: 20,
        },
        {
            A: 15,
        },
    ]);
    //await df.plot().renderImage("./test-dataframe.png");

    /*
    await df
        .plot({ chartType: ChartType.Bar })
        .renderImage("./test-dataframe.png");
    */

    await df.plot().exportWeb("c:\\temp\\test-output", { openBrowser: true, overwrite: true });
}

main()
    .then(() => {
        console.log("Done");
    })
    .catch(err => {
        console.error(err && err.stack || err);
    });



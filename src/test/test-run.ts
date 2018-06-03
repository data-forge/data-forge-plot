import { DataFrame, Series } from "data-forge";
import "../index";
import { ChartType, AxisType, HorizontalLabelPosition, VerticalLabelPosition } from "../index";

async function main(): Promise<void> {
    /*
    var series = new Series([10, 20, 15, 18, 25, 22, 13 ]);
    await series.plot().renderImage("./test-series.png");
    */


    /*
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
    */
    //await df.plot().renderImage("./test-dataframe.png");

    /*
    await df
        .plot({ chartType: ChartType.Bar })
        .renderImage("./test-dataframe.png");
    */

    //await df.plot().exportWeb("c:\\temp\\test-output", { openBrowser: true, overwrite: true });

    //await df.plot().exportNodejs("c:\\temp\\test-output-2", { overwrite: true });

    /*
    var df = new DataFrame([ 
        {
            A: 10,
            B: 12,
        },
        {
            A: 20,
            B: 15,
        },
        {
            A: 15,
            B: 22,
        },
    ]);
    */
    //await df.plot().renderImage("./test-dataframe-2.png");
    /*
    await df.plot()
        .chartType(ChartType.Bar)
        .renderImage("./test-dataframe-2.png");
    */
   /*
   await df.plot({}, { y: "A", x: "B" })
    .chartType(ChartType.Scatter)
    .renderImage("./test-dataframe-2.png");
    */

    /*

   var df = new DataFrame([ 
        {
            A: "25/04/2018",
            B: 12,
        },
        {
            A: "26/04/2018",
            B: 15,
        },
        {
            A: "27/04/2018",
            B: 22,
        },
    ]);
    await df.plot({ x: { axisType: AxisType.Timeseries }})
        .renderImage("./test-dataframe-3.png");
        */

    var df = new DataFrame([ 
        {
            A: 10,
            B: 120,
        },
        {
            A: 20,
            B: 150,
        },
        {
            A: 15,
            B: 220,
        },
    ]);

    /*
    await df.plot({ 
                x: {
                    label: {
                        text: "Blah",
                        position: HorizontalLabelPosition.InnerCenter,
                    },
                },
                y: {
                    label: "Fooey",
                },
            }, 
            { 
                y2: "B",
                series: {
                    A:  {
                        label: "A baby"
                    },
                    B: "B yeah"
                } 
            }
        )
        .renderImage("./test-dataframe-4.png");
        */
        //.exportWeb("c:/temp/test-output-3");
        //.exportNodejs("c:/temp/test-output-4");

    await df.plot()
        //todo: move B to y2!!
        .x()
            .label("Blah")
            .labelPosition(HorizontalLabelPosition.InnerRight)
        .y()
            .label("Fooster")
            .labelPosition(VerticalLabelPosition.OuterMiddle)
        .renderImage("./test-dataframe-5.png");
}

main()
    .then(() => {
        console.log("Done");
    })
    .catch(err => {
        console.error(err && err.stack || err);
    });



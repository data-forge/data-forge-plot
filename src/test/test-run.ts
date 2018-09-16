import { DataFrame, Series } from 'data-forge';
import '../index';

async function main(): Promise<void> {

    const series = new Series([10, 20, 15, 18, 25, 22, 13 ]);
    await series.plot().renderImage('./test-series.png');

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
    // await df.plot().renderImage("./test-dataframe.png");

    /*
    await df
        .plot({ chartType: ChartType.Bar })
        .renderImage("./test-dataframe.png");
    */

    // await df.plot().exportWeb("c:\\temp\\test-output", { openBrowser: true, overwrite: true });

    // await df.plot().exportNodejs("c:\\temp\\test-output-2", { overwrite: true });

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
    // await df.plot().renderImage("./test-dataframe-2.png");
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

        /*
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
    */

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
        // .exportWeb("c:/temp/test-output-3");
        // .exportNodejs("c:/temp/test-output-4");

        /*
    await df.plot()
        //todo: move B to y2!!
        .x()
            .label("Blah")
            .labelPosition(HorizontalLabelPosition.InnerRight)
        .y()
            .label("Fooster")
            .labelPosition(VerticalLabelPosition.OuterMiddle)
        //.renderImage("./test-dataframe-5.png");
        .exportWeb("c:/temp/test-output-3");
        */

        /*
    const s = new Series({
        index: ["A", "B", "C"],
        values: [100, 110, 115],
    });
    */
    const dateFormat = 'YYYY/MM/DD';
    const s = new Series({
        index: [100.14312232, 110.23232243, 115.2342345234532],
        // index: [moment("2018/05/13", dateFormat).toDate(), moment("2018/05/14", dateFormat).toDate(), moment("2018/05/15", dateFormat).toDate()],
        values: [100, 110, 115],
    });
    s.plot(/*{}, { format: { __index__: "0.00" }}*/)
        // .x()
        //    .axisType(AxisType.Category)
        // .renderImage("./test-series2.png", { openImage: true });
        .x('__index__')
            // .label("Fooey")
            // .format("0.00")
        .exportWeb('c:/temp/test-output-5', { openBrowser: true, overwrite: true });
}

main()
    .then(() => {
        console.log('Done');
    })
    .catch(err => {
        console.error(err && err.stack || err);
    });

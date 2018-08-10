//
// This example modelled on the C3 example line chart.
//
// http://c3js.org/samples/timeseries.html
//

const x = ['2013-01-01', '2013-01-02', '2013-01-03', '2013-01-04', '2013-01-05', '2013-01-06'];
const data1 = [30, 200, 100, 400, 150, 250];
const data2 = [130, 340, 200, 500, 250, 350];

import { DataFrame } from 'data-forge';
import '../../src/index';
import * as fs from 'fs-extra';
import * as path from 'path';

const outputName = path.basename(__filename, ".ts");
const outputPath = path.join("./output", outputName);
fs.emptyDirSync(outputPath);

async function main(): Promise<void> {

    const df = new DataFrame({
            columns: {
                date: x,
                data1: data1,
                data2: data2
            },
        })
        .parseDates("date", "YYYY-MM-DD")
        .setIndex<Date>("date")
        .dropSeries("date");
    
    //console.log(df.toString());
    
    const plot = df.plot();
    await plot.renderImage(path.join(outputPath, "image.png"), { openImage: false });
    await plot.exportWeb(path.join(outputPath, "web"), { overwrite: true, openBrowser: false });
    await plot.exportNodejs(path.join(outputPath, "nodejs"), { overwrite: true });    
}

main()
    .then(() => console.log("Done"))
    .catch(err => console.error(err && err.stack || err));



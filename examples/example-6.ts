//
// This example modelled on the C3 example line chart.
//
// http://c3js.org/samples/chart_bar.html
//

const data1 = [30, 200, 100, 400, 150, 250];
const data2 = [130, 100, 140, 200, 150, 50];
const data3 = [130, -150, 200, 300, -200, 100];

import { DataFrame } from 'data-forge';
import '../src/index';
import * as fs from 'fs-extra';
import * as path from 'path';
import { ChartType } from '../src/chart-def';

fs.emptyDirSync("./output");

const outputName = path.basename(__filename, ".ts");
const outputPath = path.join("./output", outputName);
fs.emptyDirSync(outputPath);

async function main(): Promise<void> {

    const df = new DataFrame({
            columns: {
                data1: data1,
                data2: data2,
                data3: data3,
            },
        });
    
    console.log(df.toString());
    
    const plot = df.plot()
        .chartType(ChartType.Bar);
    await plot.renderImage(path.join(outputPath, "image.png"), { openImage: true });
    await plot.exportWeb(path.join(outputPath, "web"), { overwrite: true, openBrowser: true });
    await plot.exportNodejs(path.join(outputPath, "nodejs"), { overwrite: true });    
}

main()
    .then(() => console.log("Done"))
    .catch(err => console.error(err && err.stack || err));



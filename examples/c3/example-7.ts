//
// This example modelled on the C3 example line chart.
//
// http://c3js.org/samples/chart_scatter.html
//

const versicolor_x = [ 3.2, 3.2, 3.1, 2.3, 2.8, 2.8, 3.3, 2.4, 2.9, 2.7, 2.0, 3.0, 2.2, 2.9, 2.9, 3.1, 3.0, 2.7, 2.2, 2.5, 3.2, 2.8, 2.5, 2.8, 2.9, 3.0, 2.8, 3.0, 2.9, 2.6, 2.4, 2.4, 2.7, 2.7, 3.0, 3.4, 3.1, 2.3, 3.0, 2.5, 2.6, 3.0, 2.6, 2.3, 2.7, 3.0, 2.9, 2.9, 2.5, 2.8 ];
const versicolor_y = [ 1.4, 1.5, 1.5, 1.3, 1.5, 1.3, 1.6, 1.0, 1.3, 1.4, 1.0, 1.5, 1.0, 1.4, 1.3, 1.4, 1.5, 1.0, 1.5, 1.1, 1.8, 1.3, 1.5, 1.2, 1.3, 1.4, 1.4, 1.7, 1.5, 1.0, 1.1, 1.0, 1.2, 1.6, 1.5, 1.6, 1.5, 1.3, 1.3, 1.3, 1.2, 1.4, 1.2, 1.0, 1.3, 1.2, 1.3, 1.3, 1.1, 1.3 ];

import { DataFrame } from 'data-forge';
import '../../src/index';
import * as fs from 'fs-extra';
import * as path from 'path';
import { ChartType } from '../../src/chart-def';

fs.emptyDirSync("./output");

const outputName = path.basename(__filename, ".ts");
const outputPath = path.join("./output", outputName);
fs.emptyDirSync(outputPath);

async function main(): Promise<void> {

    const df = new DataFrame({
            columns: {
                versicolor_x: versicolor_x,
                versicolor_y: versicolor_y,
            },
        });
    
    console.log(df.toString());
    
    const plot = df.plot({ chartType: ChartType.Scatter }, { x: "versicolor_x", y: "versicolor_y" });
    await plot.renderImage(path.join(outputPath, "image.png"), { openImage: true });
    await plot.exportWeb(path.join(outputPath, "web"), { overwrite: true, openBrowser: true });
    await plot.exportNodejs(path.join(outputPath, "nodejs"), { overwrite: true });    
}

main()
    .then(() => console.log("Done"))
    .catch(err => console.error(err && err.stack || err));



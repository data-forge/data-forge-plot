//
// This example modelled on the C3 example line chart.
//
// http://c3js.org/samples/simple_multiple.html
//

const data1 = [30, 200, 100, 400, 150, 250];
const data2 = [50, 20, 10, 40, 15, 25];
        
import { DataFrame } from 'data-forge';
import '../src/index';
import * as fs from 'fs-extra';
import * as path from 'path';

fs.emptyDirSync("./output");
fs.emptyDirSync("./output/test-1");

const outputPath = "./output/test-1";

async function main(): Promise<void> {

    const df = new DataFrame({
        columns: {
            data1: data1,
            data2: data2
        },
    });
    
    console.log(df.toString());
    
    const plot = df.plot();
    await plot.renderImage(path.join(outputPath, "image.png"), { openImage: true });
    await plot.exportWeb(path.join(outputPath, "web"), { overwrite: true, openBrowser: true });
    await plot.exportNodejs(path.join(outputPath, "nodejs"), { overwrite: true });
    
}

main()
    .then(() => console.log("Done"))
    .catch(err => console.error(err && err.stack || err));



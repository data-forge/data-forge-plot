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

const outputName = path.basename(__filename, ".ts");
const outputPath = path.join("./output", outputName);
fs.emptyDirSync(outputPath);

async function main(): Promise<void> {

    const df = new DataFrame({
        columns: {
            data1: data1,
            data2: data2
        },
    });
    
    //console.log(df.toString());
    
    const plot = df.plot();
    await plot.renderImage(path.join(outputPath, "image.png"), { openImage: false });
    await plot.exportWeb(path.join(outputPath, "web"), { overwrite: true, openBrowser: false });
}

main()
    .then(() => console.log("Done"))
    .catch(err => console.error(err && err.stack || err));



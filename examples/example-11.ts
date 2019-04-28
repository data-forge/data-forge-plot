//
// Example of rendering a line chart from real data.
//

import * as dataForge from 'data-forge';
import 'data-forge-fs';
import 'data-forge-indicators';
import '../src/index';
import * as fs from 'fs-extra';
import * as path from 'path';

const outputName = path.basename(__filename, ".ts");
const outputPath = path.join("./output", outputName);
fs.emptyDirSync(outputPath);

async function main(): Promise<void> {

    let df = (await dataForge.readFileSync("./STW.csv").parseCSV({ dynamicTyping: true }))
        .parseDates("date", "D/MM/YYYY");
    df = df.merge(df.deflate(row => row.close).bollinger(20, 2, 2));

    const plot = df.plot({}, { x: "date", y: [ "close", "upper", "middle", "lower" ] });
    await plot.renderImage(path.join(outputPath, "image.png"), { openImage: false });
    await plot.exportWeb(path.join(outputPath, "web"), { overwrite: true, openBrowser: false });
}

main()
    .then(() => console.log("Done"))
    .catch(err => console.error(err && err.stack || err));



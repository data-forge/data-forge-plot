//
// This example modelled on the C3 example line chart.
//
// http://c3js.org/samples/chart_scatter.html
//

const versicolor_x = [ 3.2, 3.2, 3.1, 2.3, 2.8, 2.8, 3.3, 2.4, 2.9, 2.7, 2.0, 3.0, 2.2, 2.9, 2.9, 3.1, 3.0, 2.7, 2.2, 2.5, 3.2, 2.8, 2.5, 2.8, 2.9, 3.0, 2.8, 3.0, 2.9, 2.6, 2.4, 2.4, 2.7, 2.7, 3.0, 3.4, 3.1, 2.3, 3.0, 2.5, 2.6, 3.0, 2.6, 2.3, 2.7, 3.0, 2.9, 2.9, 2.5, 2.8 ];
const versicolor_y = [ 1.4, 1.5, 1.5, 1.3, 1.5, 1.3, 1.6, 1.0, 1.3, 1.4, 1.0, 1.5, 1.0, 1.4, 1.3, 1.4, 1.5, 1.0, 1.5, 1.1, 1.8, 1.3, 1.5, 1.2, 1.3, 1.4, 1.4, 1.7, 1.5, 1.0, 1.1, 1.0, 1.2, 1.6, 1.5, 1.6, 1.5, 1.3, 1.3, 1.3, 1.2, 1.4, 1.2, 1.0, 1.3, 1.2, 1.3, 1.3, 1.1, 1.3 ];
const setosa_x = [ 3.5, 3.0, 3.2, 3.1, 3.6, 3.9, 3.4, 3.4, 2.9, 3.1, 3.7, 3.4, 3.0, 3.0, 4.0, 4.4, 3.9, 3.5, 3.8, 3.8, 3.4, 3.7, 3.6, 3.3, 3.4, 3.0, 3.4, 3.5, 3.4, 3.2, 3.1, 3.4, 4.1, 4.2, 3.1, 3.2, 3.5, 3.6, 3.0, 3.4, 3.5, 2.3, 3.2, 3.5, 3.8, 3.0, 3.8, 3.2, 3.7, 3.3 ];
const setosa_y = [ 0.2, 0.2, 0.2, 0.2, 0.2, 0.4, 0.3, 0.2, 0.2, 0.1, 0.2, 0.2, 0.1, 0.1, 0.2, 0.4, 0.4, 0.3, 0.3, 0.3, 0.2, 0.4, 0.2, 0.5, 0.2, 0.2, 0.4, 0.2, 0.2, 0.2, 0.2, 0.4, 0.1, 0.2, 0.2, 0.2, 0.2, 0.1, 0.2, 0.2, 0.3, 0.3, 0.2, 0.6, 0.4, 0.3, 0.2, 0.2, 0.2, 0.2 ];

import { DataFrame } from 'data-forge';
import '../src/index';
import * as fs from 'fs-extra';
import * as path from 'path';
import { ChartType, IAxisMap } from '../src/chart-def';

fs.emptyDirSync("./output");

const outputName = path.basename(__filename, ".ts");
const outputPath = path.join("./output", outputName);
fs.emptyDirSync(outputPath);

async function main(): Promise<void> {

    const df = new DataFrame({
            columns: {
                versicolor_x: versicolor_x,
                versicolor_y: versicolor_y,
                setosa_x: setosa_x,
                setosa_y: setosa_y,  
            },
        });
    
    console.log(df.head(10).toString());
    
    const plot = df.plot(
        { 
            chartType: ChartType.Scatter 
        }, 
        {
            y: [
                {
                    series: "versicolor_y",
                    label: "Versicolor",
                    color: "blue",
                    x: {
                        series: "versicolor_x",
                    }
                },
                {
                    series: "setosa_y",
                    label: "Setosa",
                    color: "green",
                    x: {
                        series: "setosa_x",
                    }
                },
            ],
        }
    );

    await plot.renderImage(path.join(outputPath, "image.png"), { openImage: true });
    await plot.exportWeb(path.join(outputPath, "web"), { overwrite: true, openBrowser: true });
    await plot.exportNodejs(path.join(outputPath, "nodejs"), { overwrite: true });    
}

main()
    .then(() => console.log("Done"))
    .catch(err => console.error(err && err.stack || err));



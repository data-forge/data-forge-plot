const Nightmare = require("nightmare");
import { WebServer, IWebServer }  from "./web-server";
import { IPlotDef, IAxisMap, IChartDef } from ".";

declare const document: any;

const selector = "svg";

/**
 * Interface to the chart renderer.
 * This component is responsible for turning data and a chart definition into a chart.
 */
export interface IChartRenderer {

    /**
     * Start the chart renderer.
     * For performance reasons the chart render can be reused to render multiple charts.
     */
    start (showBrowser: boolean): void;

    /**
     * Finish the chart renderer.
     */
    /*async*/ end (): Promise<void>;

    /**
     * Create a chart from data and a chart definition and render it to an image file.
     */
    /*async*/ renderImage (chartDef: IChartDef, outputFilePath: string): Promise<void>;
}

/**
 * This component is responsible for turning data and a chart definition into a chart.
 */
export class ChartRenderer implements IChartRenderer {

    /**
     * Nightmare headless browser instance.
     */
    nightmare: any | null = null;

    /**
     * The port for the web server that serves the interative chart.
     */
    webServerPortNo: number = 3000;

    /**
     * Interface to the web-server that serves the interactive chart.
     */
    webServer: IWebServer | null = null;

    /**
     * Start the chart renderer.
     * For performance reasons the chart render can be reused to render multiple charts.
     */
    async start (showBrowser: boolean): Promise<void> {
        this.webServer = new WebServer(this.webServerPortNo);
        await this.webServer.start();

        this.nightmare = new Nightmare({
            show: showBrowser,
            frame: showBrowser,
        });

        this.nightmare.on('crashed', (evt: any) => {
            throw new Error("Nightmare crashed " + evt.toString());
        });

        this.nightmare.on('console', (type: string, message: string) => {

            if (type === 'log') {
                console.log('LOG: ' + message);
                return;
            }
    
            if (type === 'warn') {
                console.warn('LOG: ' + message);
                return;
            }
    
            if (type === 'error') {
                console.error("Browser JavaScript error:");
                console.error(message);
            }
        });
    }

    /**
     * Finish the chart renderer.
     */
    async end (): Promise<void> {

        await this.nightmare!.end();
        this.nightmare = null;

        await this.webServer!.stop();
        this.webServer = null;
    }

    /**
     * Load the chart into the Electron browser.
     */
    async loadChart (chartDef: IChartDef): Promise<void> {

        this.webServer!.chartDef = chartDef; //todo: this might prevent charts from being rendered in parallel!

        this.nightmare.goto(this.webServer!.getUrl()); 
        await this.nightmare.wait(selector);
    }

    /**
     * Create a chart from data and a chart definition and render it to an image file.
     */
    async renderImage (chartDef: IChartDef, outputFilePath: string): Promise<void> {
        await this.loadChart(chartDef);

        await this.nightmare.evaluate(
                (selector: string) => {
                    const body = document.querySelector('body');
                    const element = document.querySelector(selector);
                    const rect = element.getBoundingClientRect();
                    return {
                        bodyWidth: body.scrollWidth,
                        bodyHeight: body.scrollHeight,
                        x: rect.left,
                        y: rect.top,
                        height: rect.bottom - rect.top,
                        width: rect.right - rect.left,
                    };
                }, 
                selector
            )
            .then((rect: any) => {
                return this.nightmare
                    .viewport(rect.bodyWidth, rect.bodyHeight)
                    .screenshot(outputFilePath, rect);
            });
    }
}